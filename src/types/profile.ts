export interface ProfileResponse {
  displayName: string;
  email: string;
  cardLimits: {
    dailyLimit: number;
    monthlyLimit: number;
    currentLimit: number;
  } | null;
  controls: {
    panicMode: boolean;
    reversePinEnabled: boolean;
  };
}

export interface UpdateDisplayNameRequest {
  displayName: string;
}

export interface UpdateCardLimitsRequest {
  dailyLimit?: number;
  monthlyLimit?: number;
}

export interface ToggleModeRequest {
  enabled: boolean;
}

export interface ChangePinRequest {
  currentPin: string;
  newPin: string;
}

export interface VerifyPinRequest {
  pin: string;
}

export interface VerifyPinResponse {
  valid: boolean;
  panicMode: boolean;
  message: string;
}
