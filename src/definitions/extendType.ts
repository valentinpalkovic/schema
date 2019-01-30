import { NexusTypes, withNexusSymbol } from "./_types";
import { OutputDefinitionBlock } from "./blocks";
import { assertValidName } from "graphql";

export interface NexusExtendTypeConfig<
  TypeName extends string,
  GenTypes = NexusGen
> {
  type: TypeName;
  definition(t: OutputDefinitionBlock<TypeName, GenTypes>): void;
}

export class NexusExtendTypeDef<TypeName extends string> {
  constructor(
    readonly name: TypeName,
    protected config: NexusExtendTypeConfig<any, any>
  ) {
    assertValidName(name);
  }
  get value() {
    return this.config;
  }
}

withNexusSymbol(NexusExtendTypeDef, NexusTypes.ExtendObject);

/**
 * Adds new fields to an existing type in the schema. Useful when splitting your
 * schema across several domains.
 *
 * @see http://graphql-nexus.com/api/extendType
 */
export function extendType<TypeName extends string>(
  config: NexusExtendTypeConfig<TypeName>
) {
  return new NexusExtendTypeDef(config.type, config);
}
