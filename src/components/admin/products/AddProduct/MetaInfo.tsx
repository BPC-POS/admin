import React from 'react';
import { Grid, TextField } from '@mui/material';

interface FormData {
  meta: Record<string, unknown>;
  [key: string]: unknown;
}

interface FormErrors {
  meta?: string;
  [key: string]: string | undefined;
}

interface MetaInfoProps {
  formData: FormData;
  errors: FormErrors;   
  handleMetaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const MetaInfo: React.FC<MetaInfoProps> = ({ formData, errors, handleMetaChange }) => {
  return (
    <Grid item xs={12}>
      <TextField
        fullWidth label="Meta (JSON Object)" multiline rows={2} value={JSON.stringify(formData.meta)}
        onChange={handleMetaChange}
        error={!!errors.meta} helperText={errors.meta} className="bg-white/50 backdrop-blur-sm rounded-lg"
      />
    </Grid>
  );
};

export default MetaInfo;