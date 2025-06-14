export interface Ingredient {
    _id: string;
    name: string;
    type: 'bun' | 'main' | 'sauce';
    proteins: number;
    fat: number;
    carbohydrates: number;
    calories: number;
    price: number;
    image: string;
    image_mobile: string;
    image_large: string;
    __v: number;
}

export interface IngredientsResponse {
    success: boolean;
    data: Ingredient[];
}

export interface User {
    email: string;
    name: string;
}

export interface UserResponse {
    success: boolean;
    user: User;
}

export interface OrderResponse {
    success: boolean;
    name: string;
    order: {
        number: number;
    };
}
