import {
    HiddenField,
    TimeField,
    DateField,
    DateTimeField,
    SplitDateTimeField,
    CharField,
    UUIDField,
    SlugField,
    TextField,
    JSONFormField,
    JSONField,
    ArrayField,
    ImageField,
    FileField,
    URLField,
    EmailField,
    FloatField,
    AutocompleteField,
    ModelChoiceField,
    ModelMultipleChoiceField,
    DecimalField,
    IntegerField,
    BooleanField,
    NullBooleanField,
    ChoiceField,
    TypedChoiceField,
    InlineForeignKeyField
} from "./field_inputs";
import {
    RelatedField as RelatedFieldValue,
    ManyRelatedField as ManyRelatedFieldValue,
    MethodField as MethodFieldValue,
    ImageField as ImageFieldValue,
    FileField as FileFieldValue,
    JSONField as JSONFieldValue,
    ArrayField as ArrayFieldValue,
    BooleanField as BooleanFieldValue,
    TimeField as TimeFieldValue,
    DateField as DateFieldValue,
    DateTimeField as DateTimeFieldValue,
    IntegerField as IntegerFieldValue,
    FloatField as FloatFieldValue,
    DecimalField as DecimalFieldValue,
    CharField as CharFieldValue,
    URLField as URLFieldValue,
    EmailField as EmailFieldValue,
    SlugField as SlugFieldValue,
    UUIDField as UUIDFieldValue,
    TextField as TextFieldValue
} from "./field_values";

import { fields_inputs_map_override } from "./override";
import { fields_values_map_override } from "./override";

export const fields_inputs_map = {
    HiddenField: HiddenField,

    ImageField: ImageField,
    FileField: FileField,

    JSONFormField: JSONFormField,
    JSONField: JSONField,
    ArrayField: ArrayField,

    BooleanField: BooleanField,
    NullBooleanField: NullBooleanField,

    TimeField: TimeField,
    DateField: DateField,
    DateTimeField: DateTimeField,
    SplitDateTimeField: SplitDateTimeField,

    IntegerField: IntegerField,
    FloatField: FloatField,
    DecimalField: DecimalField,

    CharField: CharField,
    URLField: URLField,
    EmailField: EmailField,
    SlugField: SlugField,
    UUIDField: UUIDField,
    TextField: TextField,

    ChoiceField: ChoiceField,
    TypedChoiceField: TypedChoiceField,

    AutocompleteField: AutocompleteField,
    ModelChoiceField: ModelChoiceField,
    ModelMultipleChoiceField: ModelMultipleChoiceField,
    InlineForeignKeyField: InlineForeignKeyField,

    ...fields_inputs_map_override
};

export const fields_values_map = {
    RelatedField: RelatedFieldValue,
    ManyRelatedField: ManyRelatedFieldValue,
    MethodField: MethodFieldValue,

    ImageField: ImageFieldValue,
    FileField: FileFieldValue,

    JSONField: JSONFieldValue,
    ArrayField: ArrayFieldValue,

    BooleanField: BooleanFieldValue,

    TimeField: TimeFieldValue,
    DateField: DateFieldValue,
    DateTimeField: DateTimeFieldValue,

    IntegerField: IntegerFieldValue,
    FloatField: FloatFieldValue,
    DecimalField: DecimalFieldValue,

    CharField: CharFieldValue,
    URLField: URLFieldValue,
    EmailField: EmailFieldValue,
    SlugField: SlugFieldValue,
    UUIDField: UUIDFieldValue,
    TextField: TextFieldValue,

    ...fields_values_map_override
};
