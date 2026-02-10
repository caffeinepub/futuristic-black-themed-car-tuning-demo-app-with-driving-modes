import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TuningParameters {
    suspensionStiffness: number;
    brakeBias: number;
    steeringSensitivity: number;
    throttleResponse: number;
}
export interface FuelInjectionSettings {
    temperature: number;
    pressure: number;
    amount: number;
}
export interface CarTuningConfig {
    tuningParams: TuningParameters;
    driveMode: DriveMode;
}
export interface UserProfile {
    name: string;
}
export interface ScooterTuning {
    weight: number;
    maxSpeed: number;
    acceleration: number;
    handling: number;
}
export enum DriveMode {
    city = "city",
    classic = "classic",
    sports = "sports"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFuelInjectionSettings(): Promise<FuelInjectionSettings | null>;
    getScooterTuningConfig(): Promise<ScooterTuning | null>;
    getThrottleSetting(): Promise<bigint>;
    getTuningConfig(): Promise<CarTuningConfig | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveFuelInjectionSettings(settings: FuelInjectionSettings): Promise<void>;
    saveScooterTuningConfig(config: ScooterTuning): Promise<void>;
    saveThrottleSetting(value: bigint): Promise<void>;
    saveTuningConfig(config: CarTuningConfig): Promise<void>;
    updateDriveMode(driveMode: DriveMode): Promise<void>;
    updateTuningParameters(params: TuningParameters): Promise<void>;
}
