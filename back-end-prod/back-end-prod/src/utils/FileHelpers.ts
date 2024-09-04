const returnSupabaseImagePath = (fileName: string) => {
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.IMAGE_BUCKET}/${fileName}`;
};

const returnSupabasePdfPath = (fileName: string) => {
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.PDF_BUCKET}/${fileName}`;
};

const s3ImagePath = (fileName: string) => {
  return `https://${process.env.S3_AWS_BUCKET}.s3.${process.env.MY_AWS_REGION}.amazonaws.com/images/${fileName}`;
};

const s3PdfPath = (fileName: string) => {
  return `https://${process.env.S3_AWS_BUCKET}.s3.${process.env.MY_AWS_REGION}.amazonaws.com/pdfs/${fileName}`;
};

export const getImageFileLink = (fileName: string) =>
  process.env.NODE_ENV === 'production'
    ? s3ImagePath(fileName)
    : returnSupabaseImagePath(fileName);

export const getPdfFileLink = (fileName: string) =>
  process.env.NODE_ENV === 'production'
    ? s3PdfPath(fileName)
    : returnSupabasePdfPath(fileName);
