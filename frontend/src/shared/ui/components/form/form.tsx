import { useForm } from 'react-hook-form';
import { Form as AntForm, Input, Select } from 'antd';
import styles from './form.module.css';

interface FormField {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'date' | 'select';
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface FormGroup {
  title: string;
  fields: FormField[];
}

interface FormProps {
  groups: FormGroup[];
  onSubmit: (data: Record<string, any>) => void;
  defaultValues?: Record<string, any>;
}

export const Form = ({ groups, onSubmit, defaultValues }: FormProps) => {
  const { handleSubmit, register, formState: { errors } } = useForm({
    defaultValues,
  });

  const onFormSubmit = (data: Record<string, any>) => {
    onSubmit(data);
  };

  return (
    <AntForm onFinish={handleSubmit(onFormSubmit)} layout="vertical" className={styles.formContainer}>
      {groups.map((group, groupIndex) => (
        <AntForm.Item key={groupIndex} label={group.title}>
          <div className={styles.formGroupContent}>
            {group.fields.map((field) => (
              <AntForm.Item
                key={field.name}
                label={field.label}
                validateStatus={errors[field.name] ? 'error' : ''}
                help={errors[field.name]?.message ? String(errors[field.name]?.message) : ''}
              >
                {field.type === 'select' ? (
                  <Select
                    {...register(field.name, { required: field.required })}
                    style={{ width: '100%' }}
                    options={field.options}
                  />
                ) : (
                  <Input
                    type={field.type || 'text'}
                    {...register(field.name, { required: field.required })}
                  />
                )}
              </AntForm.Item>
            ))}
          </div>
        </AntForm.Item>
      ))}
    </AntForm>
  );
};
