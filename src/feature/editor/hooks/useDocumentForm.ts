import { useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom'; 
import { useForm } from 'react-hook-form';
import { useDocumentById, useDocumentMutations } from '../../document';

type DocumentFormData = {
  title: string;
  category: string;
  htmlText: string;
};

export function useDocumentForm() { 
  const { id } = useParams(); 
  const navigate = useNavigate(); 
    
  const isEditing = Boolean(id);
  const documentId = id ? Number(id) : undefined;

  const { document } = useDocumentById(documentId);

  const isLoadingData = isEditing && !document; 

  const methods = useForm<DocumentFormData>({
    defaultValues: {
      title: '',
      category: '', 
      htmlText: '',
    },
  });

  const { handleSubmit, reset } = methods;
  const { createDocument, isSaving, updateDocument } = useDocumentMutations();
    
  useEffect(() => {
    if (isEditing && document) {
      reset({
        title: document.title,
        category: document.category,
        htmlText: document.htmlText,
      });
    }
  }, [document, isEditing, reset]);

  const onSubmit = async (data: DocumentFormData) => {
    try {
      if (isEditing && documentId) {
        await updateDocument(documentId, data);
      } else {
        const newDocument = {
          ...data,
          createdAt: new Date(),
        };
        await createDocument(newDocument);
        reset(); 
      }
      navigate('/'); 
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  return {
    methods,
    onSubmit: handleSubmit(onSubmit), 
    isLoadingData,
    isSaving,
    isEditing,
  };
}
