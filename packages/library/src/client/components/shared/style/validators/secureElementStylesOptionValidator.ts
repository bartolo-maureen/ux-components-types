import {
    SecureElementStyleWithPseudoClassesOptionValidator
} from './secureElementStyleWithPseudoClassesOptionValidator'
import { IsOptional, ValidateNested } from 'class-validator'
import { BaseOption } from '@/server/utils/baseOption'
import { SecureElementStateStyleContract } from '../types'

export class SecureElementStylesOptionValidator extends BaseOption implements SecureElementStateStyleContract {
    @IsOptional()
    @ValidateNested()
    _base?: SecureElementStyleWithPseudoClassesOptionValidator

    @IsOptional()
    @ValidateNested()
    _empty?: SecureElementStyleWithPseudoClassesOptionValidator

    @IsOptional()
    @ValidateNested()
    _valid?: SecureElementStyleWithPseudoClassesOptionValidator

    @IsOptional()
    @ValidateNested()
    _invalid?: SecureElementStyleWithPseudoClassesOptionValidator


    public get base() {
        return this._base
    }

    public get empty() {
        return this._empty
    }

    public get valid() {
        return this._valid
    }

    public get invalid() {
        return this._invalid
    }


    public set base(style: SecureElementStyleWithPseudoClassesOptionValidator) {
        this._base = this.convertAndFill(new SecureElementStyleWithPseudoClassesOptionValidator(), style)
    }

    public set empty(style: SecureElementStyleWithPseudoClassesOptionValidator) {
        this._empty = this.convertAndFill(new SecureElementStyleWithPseudoClassesOptionValidator(), style)
    }

    public set valid(style: SecureElementStyleWithPseudoClassesOptionValidator) {
        this._valid = this.convertAndFill(new SecureElementStyleWithPseudoClassesOptionValidator(), style)
    }

    public set invalid(style: SecureElementStyleWithPseudoClassesOptionValidator) {
        this._invalid = this.convertAndFill(new SecureElementStyleWithPseudoClassesOptionValidator(), style)
    }


}
