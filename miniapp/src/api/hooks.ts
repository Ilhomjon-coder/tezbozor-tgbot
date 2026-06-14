import { useQueryClient } from '@tanstack/react-query';
import {
  useCatalogControllerProducts,
  useCatalogControllerProduct,
  useCatalogControllerCategories,
  useMeControllerGetMe,
  useMeControllerListAddresses,
  useMeControllerListFavorites,
  useOrdersControllerList,
  useOrdersControllerGet,
  useSlotsControllerList,
  useOrdersControllerCreate,
  useOrdersControllerReorder,
  useOrdersControllerRate,
  useMeControllerUpdateMe,
  useMeControllerCreateAddress,
  useMeControllerUpdateAddress,
  useMeControllerDeleteAddress,
  useMeControllerAddFavorite,
  useMeControllerRemoveFavorite,
  useCatalogControllerWish,
  getCatalogControllerProductsQueryKey,
  getCatalogControllerProductQueryKey,
  getCatalogControllerCategoriesQueryKey,
  getMeControllerGetMeQueryKey,
  getMeControllerListAddressesQueryKey,
  getMeControllerListFavoritesQueryKey,
  getOrdersControllerListQueryKey,
  getOrdersControllerGetQueryKey,
  getSlotsControllerListQueryKey,
  type ProductDto,
  type CategoryDto,
  type ProfileDto,
  type AddressDto,
  type FavoriteDto,
  type OrderSummaryDto,
  type OrderDetailDto,
  type SlotsResponseDto,
  type ReorderPreviewDto,
  type CreateOrderDto,
  type RateOrderDto,
  type UpdateProfileDto,
  type CreateAddressDto,
  type UpdateAddressDto,
  type CreateWishDto,
} from '@tezbozor/shared/api';

// Thin wrappers over the orval-generated hooks. The fetcher returns a
// { status, data } envelope, so every query unwraps `.data` via `select` and
// every mutation checks the status and surfaces the backend error message.
// Never hand-write response types — they all come from the generated client.

function ok(status: number): boolean {
  return status >= 200 && status < 300;
}

// The fetcher resolves to { status, data }; `data` is `void` on non-2xx. We
// cast to the success body after an `ok()` check (orval types the union per
// status code).
function pick<T>(res: { status: number; data: unknown }, fallback: T): T {
  return ok(res.status) ? (res.data as T) : fallback;
}

function apiError(res: { status: number; data: unknown }): Error {
  const body = res.data as { message?: string | string[] } | undefined;
  const msg = Array.isArray(body?.message) ? body?.message[0] : body?.message;
  return new Error(msg || `Request failed (${res.status})`);
}

// ---- Queries ---------------------------------------------------------------

export function useProducts() {
  return useCatalogControllerProducts<ProductDto[]>({
    query: { queryKey: getCatalogControllerProductsQueryKey(), select: (res) => pick<ProductDto[]>(res, []) },
  });
}

export function useProduct(id: number, enabled = true) {
  return useCatalogControllerProduct<ProductDto | undefined>(id, {
    query: {
      queryKey: getCatalogControllerProductQueryKey(id),
      enabled: enabled && Number.isFinite(id),
      select: (res) => pick<ProductDto | undefined>(res, undefined),
    },
  });
}

export function useCategories() {
  return useCatalogControllerCategories<CategoryDto[]>({
    query: { queryKey: getCatalogControllerCategoriesQueryKey(), select: (res) => pick<CategoryDto[]>(res, []) },
  });
}

export function useProfile() {
  return useMeControllerGetMe<ProfileDto | undefined>({
    query: { queryKey: getMeControllerGetMeQueryKey(), select: (res) => pick<ProfileDto | undefined>(res, undefined) },
  });
}

export function useAddresses() {
  return useMeControllerListAddresses<AddressDto[]>({
    query: { queryKey: getMeControllerListAddressesQueryKey(), select: (res) => pick<AddressDto[]>(res, []) },
  });
}

export function useFavorites() {
  return useMeControllerListFavorites<FavoriteDto[]>({
    query: { queryKey: getMeControllerListFavoritesQueryKey(), select: (res) => pick<FavoriteDto[]>(res, []) },
  });
}

export function useOrders() {
  return useOrdersControllerList<OrderSummaryDto[]>({
    query: { queryKey: getOrdersControllerListQueryKey(), select: (res) => pick<OrderSummaryDto[]>(res, []) },
  });
}

export function useOrder(id: number, refetchMs?: number) {
  return useOrdersControllerGet<OrderDetailDto | undefined>(id, {
    query: {
      queryKey: getOrdersControllerGetQueryKey(id),
      enabled: Number.isFinite(id),
      refetchInterval: refetchMs,
      select: (res) => pick<OrderDetailDto | undefined>(res, undefined),
    },
  });
}

export function useSlots() {
  return useSlotsControllerList<SlotsResponseDto | undefined>({
    query: { queryKey: getSlotsControllerListQueryKey(), select: (res) => pick<SlotsResponseDto | undefined>(res, undefined) },
  });
}

// ---- Mutations -------------------------------------------------------------

export function useCreateOrder() {
  const qc = useQueryClient();
  const m = useOrdersControllerCreate();
  return {
    isPending: m.isPending,
    async create(dto: CreateOrderDto): Promise<OrderDetailDto> {
      const res = await m.mutateAsync({ data: dto });
      if (!ok(res.status)) throw apiError(res);
      qc.invalidateQueries({ queryKey: getOrdersControllerListQueryKey() });
      qc.invalidateQueries({ queryKey: getSlotsControllerListQueryKey() });
      return res.data as OrderDetailDto;
    },
  };
}

export function useReorder() {
  const m = useOrdersControllerReorder();
  return {
    isPending: m.isPending,
    async preview(id: number): Promise<ReorderPreviewDto> {
      const res = await m.mutateAsync({ id });
      if (!ok(res.status)) throw apiError(res);
      return res.data as ReorderPreviewDto;
    },
  };
}

export function useRateOrder() {
  const qc = useQueryClient();
  const m = useOrdersControllerRate();
  return {
    isPending: m.isPending,
    async rate(id: number, dto: RateOrderDto): Promise<void> {
      const res = await m.mutateAsync({ id, data: dto });
      if (!ok(res.status)) throw apiError(res);
      qc.invalidateQueries({ queryKey: getOrdersControllerGetQueryKey(id) });
    },
  };
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const m = useMeControllerUpdateMe();
  return {
    isPending: m.isPending,
    async update(dto: UpdateProfileDto): Promise<void> {
      const res = await m.mutateAsync({ data: dto });
      if (!ok(res.status)) throw apiError(res);
      qc.invalidateQueries({ queryKey: getMeControllerGetMeQueryKey() });
    },
  };
}

export function useCreateAddress() {
  const qc = useQueryClient();
  const m = useMeControllerCreateAddress();
  return {
    isPending: m.isPending,
    async create(dto: CreateAddressDto): Promise<AddressDto> {
      const res = await m.mutateAsync({ data: dto });
      if (!ok(res.status)) throw apiError(res);
      qc.invalidateQueries({ queryKey: getMeControllerListAddressesQueryKey() });
      return res.data as AddressDto;
    },
  };
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  const m = useMeControllerUpdateAddress();
  return {
    isPending: m.isPending,
    async update(id: number, dto: UpdateAddressDto): Promise<void> {
      const res = await m.mutateAsync({ id, data: dto });
      if (!ok(res.status)) throw apiError(res);
      qc.invalidateQueries({ queryKey: getMeControllerListAddressesQueryKey() });
    },
  };
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  const m = useMeControllerDeleteAddress();
  return {
    isPending: m.isPending,
    async remove(id: number): Promise<void> {
      const res = await m.mutateAsync({ id });
      if (!ok(res.status)) throw apiError(res);
      qc.invalidateQueries({ queryKey: getMeControllerListAddressesQueryKey() });
    },
  };
}

export function useAddFavorite() {
  const qc = useQueryClient();
  const m = useMeControllerAddFavorite();
  return {
    isPending: m.isPending,
    async add(productId: number): Promise<void> {
      const res = await m.mutateAsync({ data: { productId } });
      if (!ok(res.status)) throw apiError(res);
      qc.invalidateQueries({ queryKey: getMeControllerListFavoritesQueryKey() });
    },
  };
}

export function useRemoveFavorite() {
  const qc = useQueryClient();
  const m = useMeControllerRemoveFavorite();
  return {
    isPending: m.isPending,
    async remove(productId: number): Promise<void> {
      const res = await m.mutateAsync({ productId });
      if (!ok(res.status)) throw apiError(res);
      qc.invalidateQueries({ queryKey: getMeControllerListFavoritesQueryKey() });
    },
  };
}

export function useSendWish() {
  const m = useCatalogControllerWish();
  return {
    isPending: m.isPending,
    async send(dto: CreateWishDto): Promise<void> {
      const res = await m.mutateAsync({ data: dto });
      if (!ok(res.status)) throw apiError(res);
    },
  };
}
