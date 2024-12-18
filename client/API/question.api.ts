import api from "./middleware";

interface OnboardingData {
  question: string;
  answer: string;
}

export const completeOnboarding = async (onboardingData: OnboardingData[]) => {
  try {
    const { data } = await api.post(
      "/questions/add",
      {
        onboardingData
      },
      {
        withCredentials: true,
      }
    );

    if (data.success) {
      return {
        success: true,
        response: data.data,
      };
    } else {
      return {
        success: false,
        response: data.message,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      response: error.response.data.message || "something went wrong",
    };
  }
};

export const getgeneratedQuestions = async () => {
  try {
    const { data } = await api.get("/questions/generate", {
      withCredentials: true,
    });
    if (data.success) {
      return {
        success: true,
        response: data.data,
      };
    } else {
      return {
        success: false,
        response: data.message,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      response: error.response.data.message || "something went wrong",
    };
  }
};