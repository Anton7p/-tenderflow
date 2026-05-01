import { Form as AntForm, Input, InputNumber } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import type { UploadExcelRowModel } from '../../types/public';
import styles from './upload-excel-row-form.module.css';

type UploadExcelRowFormValues = Omit<UploadExcelRowModel, 'id'>;

interface UploadExcelRowFormProps {
  defaultValues?: Partial<UploadExcelRowFormValues>;
  onSubmit: (values: UploadExcelRowFormValues) => void;
  formId?: string;
}

export function UploadExcelRowForm(props: UploadExcelRowFormProps) {
  const { defaultValues, onSubmit, formId } = props;
  const { control, handleSubmit } = useForm<UploadExcelRowFormValues>({
    defaultValues: {
      index: 1,
      productCode: '',
      name: '',
      typeCode: '',
      unitCode: '',
      unitName: '',
      quantity: 0,
      price: 0,
      totalBeforeTax: 0,
      excise: '',
      taxRate: '',
      taxAmount: 0,
      totalWithTax: 0,
      countryCode: '',
      countryName: '',
      declarationNum: '',
      ...defaultValues,
    },
  });

  return (
    <AntForm
      id={formId}
      layout="vertical"
      onFinish={handleSubmit((values) => onSubmit(values))}
      className={styles.form}
    >
      <div className={styles.grid}>
        <Controller
          name="index"
          control={control}
          render={({ field }) => (
            <AntForm.Item label="№ п/п" className={styles.item}>
              <InputNumber {...field} controls={false} className={styles.field} />
            </AntForm.Item>
          )}
        />
        <Controller
          name="productCode"
          control={control}
          render={({ field }) => (
            <AntForm.Item label="Код товара/работ, услуг" className={styles.item}>
              <Input {...field} />
            </AntForm.Item>
          )}
        />
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <AntForm.Item label="Наименование" className={styles.item}>
              <Input {...field} />
            </AntForm.Item>
          )}
        />
        <Controller
          name="typeCode"
          control={control}
          render={({ field }) => (
            <AntForm.Item label="Код вида товара" className={styles.item}>
              <Input {...field} />
            </AntForm.Item>
          )}
        />
        <Controller
          name="unitCode"
          control={control}
          render={({ field }) => (
            <AntForm.Item label="Единица измерения: код" className={styles.item}>
              <Input {...field} />
            </AntForm.Item>
          )}
        />
        <Controller
          name="unitName"
          control={control}
          render={({ field }) => (
            <AntForm.Item label="Единица измерения: обозначение" className={styles.item}>
              <Input {...field} />
            </AntForm.Item>
          )}
        />
        <Controller
          name="quantity"
          control={control}
          render={({ field }) => (
            <AntForm.Item label="Количество (объем)" className={styles.item}>
              <InputNumber {...field} controls={false} className={styles.field} />
            </AntForm.Item>
          )}
        />
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <AntForm.Item label="Цена" className={styles.item}>
              <InputNumber {...field} controls={false} className={styles.field} />
            </AntForm.Item>
          )}
        />
        <Controller
          name="totalBeforeTax"
          control={control}
          render={({ field }) => (
            <AntForm.Item label="Стоимость без налога" className={styles.item}>
              <InputNumber {...field} controls={false} className={styles.field} />
            </AntForm.Item>
          )}
        />
        <Controller
          name="excise"
          control={control}
          render={({ field }) => (
            <AntForm.Item label="Сумма акциза" className={styles.item}>
              <Input {...field} />
            </AntForm.Item>
          )}
        />
        <Controller
          name="taxRate"
          control={control}
          render={({ field }) => (
            <AntForm.Item label="Налоговая ставка" className={styles.item}>
              <Input {...field} />
            </AntForm.Item>
          )}
        />
        <Controller
          name="taxAmount"
          control={control}
          render={({ field }) => (
            <AntForm.Item label="Сумма налога" className={styles.item}>
              <InputNumber {...field} controls={false} className={styles.field} />
            </AntForm.Item>
          )}
        />
        <Controller
          name="totalWithTax"
          control={control}
          render={({ field }) => (
            <AntForm.Item label="Стоимость с налогом" className={styles.item}>
              <InputNumber {...field} controls={false} className={styles.field} />
            </AntForm.Item>
          )}
        />
        <Controller
          name="countryCode"
          control={control}
          render={({ field }) => (
            <AntForm.Item label="Страна происхождения: код" className={styles.item}>
              <Input {...field} />
            </AntForm.Item>
          )}
        />
        <Controller
          name="countryName"
          control={control}
          render={({ field }) => (
            <AntForm.Item label="Страна происхождения: наименование" className={styles.item}>
              <Input {...field} />
            </AntForm.Item>
          )}
        />
        <Controller
          name="declarationNum"
          control={control}
          render={({ field }) => (
            <AntForm.Item label="Номер декларации" className={styles.item}>
              <Input {...field} />
            </AntForm.Item>
          )}
        />
      </div>
    </AntForm>
  );
}
