import {registerDecorator, ValidatorConstraint, ValidatorConstraintInterface, ValidationOptions,ValidationArguments} from 'class-validator';
@ValidatorConstraint({async: false})
class EqualsConstrains implements ValidatorConstraintInterface {
  validate(value: any, args:ValidationArguments): Promise<boolean> | boolean {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    const [relatedPropertyName] = validationArguments.constraints;
    return `${relatedPropertyName} does not match ${validationArguments.property}`;
  }
}
export function  Equals (property:string,validationOptions:ValidationOptions ){
  return (object:Object,propertyName:string )=>{
    registerDecorator({
      target:object.constructor,
      propertyName,
      options:validationOptions,
      constraints:[property],
      validator:EqualsConstrains
    })
  }
}