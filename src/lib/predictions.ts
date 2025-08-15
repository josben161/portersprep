import { callGateway } from "./ai";

export interface PredictionParams {
  targetSchools?: string[];
  [key: string]: any;
}

export interface PredictionResult {
  content: string;
  usage?: any;
}

/**
 * Generate predictions using the AI gateway
 * @param userId - The user ID
 * @param params - Prediction parameters including target schools
 * @returns Promise with prediction content and usage
 */
export async function generatePredictions(
  userId: string,
  params: PredictionParams = {},
): Promise<PredictionResult> {
  return await callGateway("predict", {
    userId,
    params,
  });
}

/**
 * Generate school-specific predictions
 * @param userId - The user ID
 * @param schoolIds - Array of school IDs to predict for
 * @returns Promise with prediction content and usage
 */
export async function generateSchoolPredictions(
  userId: string,
  schoolIds: string[],
): Promise<PredictionResult> {
  return await callGateway("predict", {
    userId,
    params: {
      schoolIds,
      predictionType: "detailed",
    },
  });
}

/**
 * Generate improvement plan based on predictions
 * @param userId - The user ID
 * @param predictions - Previous prediction results
 * @returns Promise with improvement plan content and usage
 */
export async function generateImprovementPlan(
  userId: string,
  predictions: any[],
): Promise<PredictionResult> {
  return await callGateway("predict", {
    userId,
    params: {
      predictions,
      planType: "improvement",
    },
  });
}
