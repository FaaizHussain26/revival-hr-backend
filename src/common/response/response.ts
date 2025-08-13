export function successResponse<T>(message?: string, data?: T) {
  return {
    success: true,
    message,
    data,
  };
}
export function errorResponse<T>(message?: string, data?: T) {
  return {
    success: false,
    message,
    data,
  };
}
export function paginationResponse<T>(message?: string, data?: T[], total?: number, current_page?: number, last_page?: number , per_page?:number) {
  return {
    success: true,
    message,
    data,
    pagination: {
      total,
      current_page,
      last_page,
      per_page,
    },
  };
}

