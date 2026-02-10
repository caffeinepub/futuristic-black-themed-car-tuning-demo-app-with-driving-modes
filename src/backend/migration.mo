import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    tuningConfigs : Map.Map<Principal, { driveMode : { #sports; #classic; #city; }; tuningParams : { suspensionStiffness : Float; steeringSensitivity : Float; throttleResponse : Float; brakeBias : Float } }>;
    scooterTuningConfigs : Map.Map<Principal, { maxSpeed : Float; acceleration : Float; handling : Float; weight : Float; }>;
    fuelInjectionSettings : Map.Map<Principal, { amount : Float; pressure : Float; temperature : Float }>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    tuningConfigs : Map.Map<Principal, { driveMode : { #sports; #classic; #city; }; tuningParams : { suspensionStiffness : Float; steeringSensitivity : Float; throttleResponse : Float; brakeBias : Float } }>;
    scooterTuningConfigs : Map.Map<Principal, { maxSpeed : Float; acceleration : Float; handling : Float; weight : Float }>;
    fuelInjectionSettings : Map.Map<Principal, { amount : Float; pressure : Float; temperature : Float }>;
    throttleSettings : Map.Map<Principal, Nat>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      throttleSettings = Map.empty<Principal, Nat>();
    };
  };
};
