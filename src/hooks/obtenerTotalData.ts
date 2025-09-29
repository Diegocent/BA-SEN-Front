export async function ObtenerTotalData(
  api: string,
  controller: string,
  params: Record<string, string | number> = {},
  per_page: number = 10
) {
  try {
    const baseUrl = import.meta.env.VITE_URL || "http://localhost:8000/api/";

    if (!baseUrl) {
      throw new Error("API base URL no configurada en variables de entorno");
    }

    // Construir la URL
    const url = new URL(
      api ? `${baseUrl}${api}/${controller}` : `${baseUrl}${controller}`
    );

    // Agregar parámetro per_page
    url.searchParams.append("per_page", per_page.toString());

    // Agregar todos los parámetros de filtro
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en simpleFetch:", error);
    throw error;
  }
}
