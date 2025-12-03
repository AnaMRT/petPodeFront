export default function useApiError() {
  const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (!data) return "Erro desconhecido. Tente novamente.";

    if (typeof data === "string") return data;

    if (data.mensagem) return data.mensagem;
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors
        .map((e) => e.defaultMessage || JSON.stringify(e))
        .join("\n");
    }

    return "Ocorreu um erro inesperado.";
  };

  return { getErrorMessage };
}
