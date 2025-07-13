import axios from "axios";
import { EnvironmentRepository } from "../../repositories";
import { Environment, NewEnvironment } from "../../schemas/environments.schema";
import { NewOperatingHour } from "../../schemas/operatingHours.schema";
import fetchImageAsBase64 from "../../utils/fetchImageAsBase64";
import { OperationHoursRepository } from "../../repositories/OperationHoursRepository";
import { UserAccessRepository } from "../../repositories/UserAccessRepository";
import { NewUserAccess } from "../../schemas/userAccess.schema";
import { EAccessRole } from "../../models/userAccess";
import { importMenu } from "../menu/import-menu";

const IFOOD_API_URL =
  'https://marketplace.ifood.com.br/v1/merchant-info/graphql?channel=IFOOD'

// A query GraphQL completa para a API do iFood
const IFOOD_MERCHANT_QUERY =
  'query ($merchantId: String!) { merchant(merchantId: $merchantId, required: true) { available availableForScheduling contextSetup { catalogGroup context regionGroup } currency deliveryFee { originalValue type value } deliveryMethods { availabilityState catalogGroup category code deliveredBy id maxTime minTime mode originalValue priority programId schedule { now scheduling shifts { dayOfWeek endTime interval startTime } timeSlots { availableLoad date endDateTime endTime id isAvailable originalPrice price startDateTime startTime } } scope state subtitle title type value } deliveryTime distance features id isFavorite mainCategory { code name } merchantChain { externalId id name resources { fileName type } slug } minimumOrderValue name nextSchedulingSlotEndTime nextSchedulingSlotStartTime preparationTime priceRange resources { fileName type } slug tags takeoutTime userRating } merchantExtra(merchantId: $merchantId, required: false) { address { city country district latitude longitude state streetName streetNumber timezone zipCode } categories { code description friendlyName } companyCode configs { bagItemNoteLength chargeDifferentToppingsMode itemObservation maxItemsPerOrder nationalIdentificationNumberRequired orderNoteLength } deliveryTime description distance documents { CNPJ { type value } MCC { type value } cnpj { type value } } enabled features groups { externalId id name type } highlightTags id locale mainCategory { code description friendlyName } merchantChain { externalId id name resources { fileName type } slug } metadata { ifoodClub { banner { action image priority title } bottomSheet { image { height url width } primaryButton { action title } secondaryButton { action title } subtitle title } } } minimumOrderValue minimumOrderValueV2 name phoneIf priceRange resources { fileName type } shifts { dayOfWeek duration start } shortId storeTypeExtraInfo { crf operatingAuthorization pharmacistName sanitaryPermit sanitaryPermitExpiration specialAuthorization specialAuthorizationExpiration } tags takeoutTime test type userRatingCount } reputation(merchantId: $merchantId) { cancellationIndicator complainsIndicator overallIndicator reviewsIndicator } social(merchantId: $merchantId) { followersCount publicationsCount } }'

async function fetchIfoodMerchantData(merchantId: string): Promise<any | null> {
  console.log("merchantId", merchantId);
  try {
    const response = await axios.post(
      IFOOD_API_URL,
      {
        query: IFOOD_MERCHANT_QUERY,
        variables: { merchantId },
      },
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
        },
      }
    );

    if (!response.data || !response.data.data || !response.data.data.merchant) {
      console.error(`Merchant ${merchantId} not found on iFood.`);
      return null;
    }

    return response.data.data;
  } catch (error) {
    console.error("Failed to call iFood API:", error);
    return null;
  }
}

function findResourceUrl(
  resources: any[],
  type: "LOGO" | "COVER"
): string | undefined {
  const resource = resources.find((r) => r.type === type);
  return resource ? `${resource.fileName}` : undefined;
}

export async function importEnvironment(payload: any): Promise<any> {
  const environmentRepository = new EnvironmentRepository();
  const operatingHoursRepository = new OperationHoursRepository();
  const userAccessRepository = new UserAccessRepository();
  try {
    const ifoodData = await fetchIfoodMerchantData(payload.ifoodMerchantId);

    if (!ifoodData) {
      return {
        httpStatus: 409,
        message: `Lojista com ID ${payload.ifoodMerchantId} não encontrado no iFood ou a API falhou.`,
      };
    }

    const { merchant, merchantExtra, reputation } = ifoodData as any;

    // 2. Mapear dados da API para os schemas do DB
    const logoUrl = findResourceUrl(merchantExtra.resources, "LOGO");
    const coverUrl = findResourceUrl(merchantExtra.resources, "COVER");

    // Busca o logo e o banner em paralelo e os converte para Base64
    const [logoBase64, coverBase64] = await Promise.all([
      logoUrl
        ? fetchImageAsBase64(
            "https://static.ifood-static.com.br/image/upload/t_thumbnail/logosgde/",
            logoUrl
          )
        : Promise.resolve(null),
      coverUrl
        ? fetchImageAsBase64(
            "https://static.ifood-static.com.br/image/upload//capa/",
            coverUrl
          )
        : Promise.resolve(null),
    ]);

    const minimumOrderValueRaw =
      merchantExtra.minimumOrderValueV2 || merchantExtra.minimumOrderValue || 0;

    const minimumOrderValueInCents = Math.round(minimumOrderValueRaw * 100);

    const environmentPayload: NewEnvironment = {
      name: merchant.name,
      cnpj: merchantExtra.documents?.CNPJ?.value || "",
      ifoodMerchantId: payload.ifoodMerchantId,
      preparationTime: merchant.preparationTime,

      categoryName: merchant.mainCategory.name,
      categoryCode: merchant.mainCategory.code || "",

      rating: String(merchant.userRating),
      minimumOrderValue: minimumOrderValueInCents,

      description: merchantExtra.description,

      timezone: merchantExtra.address.timezone,
      city: merchantExtra.address.city,
      country: merchantExtra.address.country,
      district: merchantExtra.address.district,
      latitude: merchantExtra.address.latitude,
      longitude: merchantExtra.address.longitude,
      state: merchantExtra.address.state,
      streetName: merchantExtra.address.streetName,
      streetNumber: merchantExtra.address.streetNumber,
      zipCode: merchantExtra.address.zipCode,

      logoUrl,
      logoBase64,
      coverUrl,
      coverBase64,
      reputation,
    };

    // ALTERAÇÃO AQUI: Mapeamento direto para a nova schema de operatingHours
    const operatingHoursPayload: Omit<NewOperatingHour, "environmentId">[] =
      merchantExtra.shifts
        ? merchantExtra.shifts.map((shift: any) => ({
            dayOfWeek: shift.dayOfWeek, // Ex: 'MONDAY'
            start: shift.start, // Ex: '10:00:00'
            duration: shift.duration, // Ex: 300 (minutos)
          }))
        : [];

    const environment = await environmentRepository.create(environmentPayload);
    if (operatingHoursPayload.length > 0) {
      for (const operatingHour of operatingHoursPayload) {
        await operatingHoursRepository.create({
          ...operatingHour,
          environmentId: environment.id,
        });
      }
    }

    const userAccessPayload: NewUserAccess = {
      environmentId: environment.id,
      userId: payload.userId,
      role: EAccessRole.ADMIN,
    };
    await userAccessRepository.create(userAccessPayload);
    await importMenu({ environmentId: environment.id, merchantId: payload.ifoodMerchantId }, environment.id, payload.userId);   

    return {
      httpStatus: 201,
      environment,
    };
  } catch (error) {
    console.error("Failed to import environment:", error);
    return {
      httpStatus: 500,
      message: "Failed to import environment.",
    };
  }
}
