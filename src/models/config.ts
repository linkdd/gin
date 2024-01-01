import 'reflect-metadata'

import { Type } from 'class-transformer'
import {
  IsString,
  IsOptional,
  IsObject,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator'

import { GinPlugin } from '@/models/plugin'

export class HighlighterLanguageConfig {
  @IsString()
  id: string

  @IsString()
  scopeName: string

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @IsOptional()
  aliases?: string[]

  @IsString()
  grammarPath: string
}

export class HighlighterConfig {
  @IsString()
  @IsOptional()
  theme?: string

  @IsString()
  @IsOptional()
  themePath?: string

  @ValidateNested()
  @Type(() => HighlighterLanguageConfig)
  @IsOptional()
  extraLanguages: HighlighterLanguageConfig[]
}

export class Config {
  @IsString()
  title: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  languageCode?: string

  @IsString()
  @IsOptional()
  baseURL?: string

  @IsObject()
  @IsOptional()
  params?: { [key: string]: unknown }

  @ValidateNested()
  @Type(() => HighlighterConfig)
  @IsOptional()
  highlighter?: HighlighterConfig

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  plugins?: string[]

  private async getPluginModules(): Promise<{ default: unknown }[]> {
    return await Promise.all(
      (this.plugins ?? []).map(async (pluginName) => await import(pluginName)),
    )
  }

  async getPlugins(): Promise<GinPlugin[]> {
    return (await this.getPluginModules())
      .filter((module) => module.default instanceof GinPlugin)
      .map((module) => module.default as GinPlugin)
  }
}
