import api from "./middleware";

export const getMessages = async () => {
    try {
        const { data } = await api.get("/messages/", {
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
}

export const sendChat = async (content: string) => {
    try {
        const { data } = await api.post("/chat/chat", {
            content
        }, {
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
}