import {
  OutputDefinitionBlock,
  AbstractOutputDefinitionBuilder,
} from "./blocks";
import { NexusTypes, NonNullConfig, withNexusSymbol } from "./_types";
import { assertValidName } from "graphql";
import { AbstractTypeResolver } from "../typegenTypeHelpers";

export type NexusInterfaceTypeConfig<
  TypeName extends string,
  GenTypes = NexusGen
> = {
  name: TypeName;

  // Really wanted to keep this here, but alas, it looks like there's some
  // issues around inferring the generic.
  // https://github.com/Microsoft/TypeScript/pull/29478
  // https://github.com/Microsoft/TypeScript/issues/10195
  //
  // resolveType: AbstractTypeResolver<TypeName, GenTypes>;

  definition(t: InterfaceDefinitionBlock<TypeName, GenTypes>): void;
  /**
   * Configures the nullability for the type, check the
   * documentation's "Getting Started" section to learn
   * more about GraphQL Nexus's assumptions and configuration
   * on nullability.
   */
  nonNullDefaults?: NonNullConfig;
  /**
   * The description to annotate the GraphQL SDL
   */
  description?: string | null;
};

export class InterfaceDefinitionBlock<
  TypeName extends string,
  GenTypes = NexusGen
> extends OutputDefinitionBlock<TypeName, GenTypes> {
  constructor(
    protected typeBuilder: AbstractOutputDefinitionBuilder<TypeName, GenTypes>
  ) {
    super(typeBuilder);
  }
  /**
   * Sets the "resolveType" method for the current type.
   */
  resolveType(fn: AbstractTypeResolver<TypeName, GenTypes>) {
    this.typeBuilder.setResolveType(fn);
  }
}

export class NexusInterfaceTypeDef<TypeName extends string> {
  constructor(
    readonly name: TypeName,
    protected config: NexusInterfaceTypeConfig<any, any>
  ) {
    assertValidName(name);
  }
  get value() {
    return this.config;
  }
}

withNexusSymbol(NexusInterfaceTypeDef, NexusTypes.Interface);

/**
 * Defines a GraphQLInterfaceType
 * @param config
 */
export function interfaceType<TypeName extends string, GenTypes = NexusGen>(
  config: NexusInterfaceTypeConfig<TypeName, GenTypes>
) {
  return new NexusInterfaceTypeDef(config.name, config);
}
