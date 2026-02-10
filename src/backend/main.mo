import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  // User Profile Storage
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Car/Vehicle Types
  public type DriveMode = {
    #sports;
    #classic;
    #city;
  };

  public type TuningParameters = {
    suspensionStiffness : Float;
    steeringSensitivity : Float;
    throttleResponse : Float;
    brakeBias : Float;
  };

  public type CarTuningConfig = {
    driveMode : DriveMode;
    tuningParams : TuningParameters;
  };

  // Scooter Tuning Types
  public type ScooterTuning = {
    maxSpeed : Float;
    acceleration : Float;
    handling : Float;
    weight : Float;
  };

  // Fuel Injection Settings
  public type FuelInjectionSettings = {
    amount : Float;
    pressure : Float;
    temperature : Float;
  };

  // Persistent and query methods for Car Tuning
  // No authorization required - anonymous users can access
  let tuningConfigs = Map.empty<Principal, CarTuningConfig>();

  public query ({ caller }) func getTuningConfig() : async ?CarTuningConfig {
    tuningConfigs.get(caller);
  };

  public shared ({ caller }) func saveTuningConfig(config : CarTuningConfig) : async () {
    validateConfig(config);
    tuningConfigs.add(caller, config);
  };

  public shared ({ caller }) func updateDriveMode(driveMode : DriveMode) : async () {
    let existing = switch (tuningConfigs.get(caller)) {
      case (null) { Runtime.trap("No existing configuration found. Please save your settings first.") };
      case (?config) { config };
    };

    let updatedConfig = {
      driveMode;
      tuningParams = existing.tuningParams;
    };
    tuningConfigs.add(caller, updatedConfig);
  };

  public shared ({ caller }) func updateTuningParameters(params : TuningParameters) : async () {
    let existing = switch (tuningConfigs.get(caller)) {
      case (null) { Runtime.trap("No configuration found. Please save initial settings first.") };
      case (?config) { config };
    };

    let updatedConfig = {
      driveMode = existing.driveMode;
      tuningParams = params;
    };
    validateConfig(updatedConfig);
    tuningConfigs.add(caller, updatedConfig);
  };

  func validateConfig(config : CarTuningConfig) {
    let params = config.tuningParams;
    let min = 0.0;
    let max = 10.0;

    if (params.suspensionStiffness < min or params.suspensionStiffness > max) {
      Runtime.trap("Suspension stiffness must be between 0.0 and 10.0");
    };
    if (params.steeringSensitivity < min or params.steeringSensitivity > max) {
      Runtime.trap("Steering sensitivity must be between 0.0 and 10.0");
    };
    if (params.throttleResponse < min or params.throttleResponse > max) {
      Runtime.trap("Throttle response must be between 0.0 and 10.0");
    };
    if (params.brakeBias < min or params.brakeBias > max) {
      Runtime.trap("Brake bias must be between 0.0 and 10.0");
    };
  };

  // Scooter Tuning persistent and query methods
  // No authorization required - anonymous users can access
  let scooterTuningConfigs = Map.empty<Principal, ScooterTuning>();

  public query ({ caller }) func getScooterTuningConfig() : async ?ScooterTuning {
    scooterTuningConfigs.get(caller);
  };

  public shared ({ caller }) func saveScooterTuningConfig(config : ScooterTuning) : async () {
    validateScooterConfig(config);
    scooterTuningConfigs.add(caller, config);
  };

  func validateScooterConfig(config : ScooterTuning) {
    if (config.maxSpeed < 1 or config.maxSpeed > 100) {
      Runtime.trap("Max speed must be between 1 and 100 kph");
    };

    if (config.acceleration < 0.1 or config.acceleration > 10) {
      Runtime.trap("Acceleration must be between 0.1 and 10.0 m/s^2");
    };

    if (config.handling < 1 or config.handling > 100) {
      Runtime.trap("Handling must be between 1 and 100");
    };

    if (config.weight < 1 or config.weight > 200) {
      Runtime.trap("Weight must be between 1 and 200 kg");
    };
  };

  // Fuel Injection Settings persistent and query methods
  // No authorization required - anonymous users can access
  let fuelInjectionSettings = Map.empty<Principal, FuelInjectionSettings>();

  public query ({ caller }) func getFuelInjectionSettings() : async ?FuelInjectionSettings {
    fuelInjectionSettings.get(caller);
  };

  public shared ({ caller }) func saveFuelInjectionSettings(settings : FuelInjectionSettings) : async () {
    validateFuelInjection(settings);
    fuelInjectionSettings.add(caller, settings);
  };

  func validateFuelInjection(settings : FuelInjectionSettings) {
    if (settings.amount < 0 or settings.amount > 100) {
      Runtime.trap("Fuel amount must be between 0 and 100");
    };

    if (settings.pressure < 0 or settings.pressure > 1000) {
      Runtime.trap("Pressure must be between 0 and 1000");
    };

    if (settings.temperature < -20 or settings.temperature > 120) {
      Runtime.trap("Temperature must be between -20 and 120 Celsius");
    };
  };

  // Throttle Control
  // No authorization required - anonymous users can access
  let throttleSettings = Map.empty<Principal, Nat>();

  public query ({ caller }) func getThrottleSetting() : async Nat {
    switch (throttleSettings.get(caller)) {
      case (?setting) { setting };
      case (null) { 5 };
    };
  };

  public shared ({ caller }) func saveThrottleSetting(value : Nat) : async () {
    if (value < 1 or value > 10) {
      Runtime.trap("Throttle value must be between 1 and 10");
    };
    throttleSettings.add(caller, value);
  };
};
