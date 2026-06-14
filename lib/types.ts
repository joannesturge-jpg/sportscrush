export interface ProductFormData {
  name: string;
  quantity: number;
  condition: "Mint" | "Good" | "Damaged";
  sealed: "Yes" | "No";
  lengthIn: number;
  widthIn: number;
  heightIn: number;
  weightOz: number;
}

export interface StandardizedProduct {
  title: string;
  description: string;
  tags: string[];
}

export interface PublishResult {
  platform: "sheets" | "shopify" | "ebay" | "shipstation";
  success: boolean;
  configured?: boolean;
  url?: string;
  id?: string;
  error?: string;
}

export interface SessionData {
  formData: ProductFormData;
  standardized: StandardizedProduct;
}
