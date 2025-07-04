import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { supabase } from "./supabase";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

// Direct Supabase operations for frontend use
export const supabaseAPI = {
  async getDoctors() {
    const { data, error } = await supabase.from('doctors').select('*');
    if (error) throw error;
    return data || [];
  },
  
  async createDoctor(doctor: any) {
    const { data, error } = await supabase.from('doctors').insert(doctor).select().single();
    if (error) throw error;
    return data;
  },
  
  async updateDoctor(id: number, doctor: any) {
    const { data, error } = await supabase.from('doctors').update(doctor).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  
  async deleteDoctor(id: number) {
    const { error } = await supabase.from('doctors').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
