import { SecureElementStyleOptionValidator } from './secureElementStyleOptionValidator'
import { SecureElementStyleWithPseudoClassContract } from '../types'
import { IsOptional, ValidateNested } from 'class-validator'

export class SecureElementStyleWithPseudoClassesOptionValidator extends SecureElementStyleOptionValidator implements SecureElementStyleWithPseudoClassContract {
    @IsOptional()
    @ValidateNested()
    '_:hover'?: SecureElementStyleWithPseudoClassesOptionValidator

    @IsOptional()
    @ValidateNested()
    '_:active'?: SecureElementStyleWithPseudoClassesOptionValidator

    @IsOptional()
    @ValidateNested()
    '_:disabled'?: SecureElementStyleWithPseudoClassesOptionValidator

    @IsOptional()
    @ValidateNested()
    '_:focus'?: SecureElementStyleWithPseudoClassesOptionValidator

    @IsOptional()
    @ValidateNested()
    '_::placeholder'?: SecureElementStyleWithPseudoClassesOptionValidator

    @IsOptional()
    @ValidateNested()
    '_::selection'?: SecureElementStyleWithPseudoClassesOptionValidator

    @IsOptional()
    @ValidateNested()
    '_:-webkit-autofill'?: SecureElementStyleWithPseudoClassesOptionValidator


    public get ':hover'() {
        return this['_:hover']
    }

    public get ':disabled'() {
        return this['_:disabled']
    }

    public get ':focus'() {
        return this['_:focus']
    }

    public get '::placeholder'() {
        return this['_::placeholder']
    }

    public get '::selection'() {
        return this['_::selection']
    }

    public get ':-webkit-autofill'() {
        return this['_:-webkit-autofill']
    }

    public get ':active'() {
        return this['_:active']
    }

    public set ':active'(style: SecureElementStyleWithPseudoClassesOptionValidator) {
        this['_:active'] = this.convertAndFill(new SecureElementStyleWithPseudoClassesOptionValidator, style)
    }

    public set ':hover'(style: SecureElementStyleWithPseudoClassesOptionValidator) {
        this['_:hover'] = this.convertAndFill(new SecureElementStyleWithPseudoClassesOptionValidator, style)
    }

    public set ':disabled'(style: SecureElementStyleWithPseudoClassesOptionValidator) {
        this['_:disabled'] = this.convertAndFill(new SecureElementStyleWithPseudoClassesOptionValidator, style)
    }

    public set ':focus'(style: SecureElementStyleWithPseudoClassesOptionValidator) {
        this['_:focus'] = this.convertAndFill(new SecureElementStyleWithPseudoClassesOptionValidator, style)
    }

    public set '::placeholder'(style: SecureElementStyleWithPseudoClassesOptionValidator) {
        this['_::placeholder'] = this.convertAndFill(new SecureElementStyleWithPseudoClassesOptionValidator, style)
    }

    public set '::selection'(style: SecureElementStyleWithPseudoClassesOptionValidator) {
        this['_::selection'] = this.convertAndFill(new SecureElementStyleWithPseudoClassesOptionValidator, style)
    }

    public set ':-webkit-autofill'(style: SecureElementStyleWithPseudoClassesOptionValidator) {
        this[':-webkit-autofill'] = this.convertAndFill(new SecureElementStyleWithPseudoClassesOptionValidator, style)
    }
}
