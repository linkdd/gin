import { IsString, IsOptional, IsObject, IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import 'reflect-metadata'

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
  params?: { [key: string]: any }

  @ValidateNested()
  @Type(() => HighlighterConfig)
  @IsOptional()
  highlighter?: HighlighterConfig
}
