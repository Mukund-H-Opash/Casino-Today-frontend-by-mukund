'use client';
import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Paper,
  Button,
  Grid,
  FormControlLabel,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { createCustomPage } from '@/store/apps/custom-pages/CustomPageSlice';
import { toast } from 'react-toastify';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import BlankCard from '../../shared/BlankCard';
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });



interface CustomPageData {
  title: string;
  slug: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  body: string;
  status: 'enabled' | 'disabled';
}

const initialCustomPageState: CustomPageData = {
  title: '',
  slug: '',
  seoTitle: '',
  metaDescription: '',
  excerpt: '',
  body: '',
  status: 'enabled',
};

const CreateCasinoCustom = () => {
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;
  const borderColor = theme.palette.divider;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [customPage, setCustomPage] = useState<CustomPageData>(initialCustomPageState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;
    const key = name as keyof CustomPageData;

    if (key === 'title' && !customPage.slug) {
      const newSlug = value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      setCustomPage({ ...customPage, title: value, slug: newSlug });
    } else if (key === 'status') {
      setCustomPage({ ...customPage, status: checked ? 'enabled' : 'disabled' });
    } else {
      setCustomPage({ ...customPage, [key]: value });
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await dispatch(createCustomPage(customPage)).unwrap();
      router.push('/content/custom-pages');
    } catch (error) {
      console.error('Failed to create custom page:', error);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/content/custom-pages');
  };

  return (
    <BlankCard>
     <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
            <Typography variant="h6" fontWeight={600} fontSize={18}>
              Create Custom Page
            </Typography>
          </Box>
<Box sx={{ p: 2 }}>
      {/* General Information Section */}
      <Paper
        variant="outlined"
        sx={{ mb: 3, border: `1px solid ${borderColor}` }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ bgcolor: primaryLight ,p: 2, borderRadius: '4px'} }>
          General Information
        </Typography>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="title">Title</CustomFormLabel>
            <CustomTextField
              id="title"
              name="title"
              value={customPage.title}
              onChange={handleInputChange}
              placeholder="Welcome Bonus Terms"
              fullWidth
            />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="slug">Slug</CustomFormLabel>
            <CustomTextField
              id="slug"
              name="slug"
              value={customPage.slug}
              onChange={handleInputChange}
              placeholder="welcome-bonus-terms"
              fullWidth
            />
          </Grid> */}
          {/* <Grid item xs={12} sm={6}>
            <CustomFormLabel>Status</CustomFormLabel>
            <Box>
              <FormControlLabel
                control={
                  <CustomSwitch
                    id="status"
                    name="status"
                    checked={customPage.status === 'enabled'}
                    onChange={handleInputChange}
                  />
                }
                label={customPage.status === 'enabled' ? 'Enabled' : 'Disabled'}
              />
            </Box>
          </Grid> */}
        </Grid>
      </Paper>

      {/* SEO Section */}
      <Paper
        variant="outlined"
        sx={{ mb: 3, border: `1px solid ${borderColor}` }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ bgcolor: primaryLight ,p: 2, borderRadius: '4px'} }>
          SEO
        </Typography>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="seoTitle">SEO Title</CustomFormLabel>
            <CustomTextField
              id="seoTitle"
              name="seoTitle"
              value={customPage.seoTitle}
              onChange={handleInputChange}
              placeholder="Welcome Bonus Terms - Grand Fortune Casino"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="metaDescription">Meta Description</CustomFormLabel>
            <CustomTextField
              id="metaDescription"
              name="metaDescription"
              value={customPage.metaDescription}
              onChange={handleInputChange}
              placeholder="Learn about the terms and conditions for the welcome bonus."
              fullWidth
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Content Section */}
      <Paper
        variant="outlined"
        sx={{ mb: 3, border: `1px solid ${borderColor}` }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ bgcolor: primaryLight ,p: 2, borderRadius: '4px'} }>
          Content
        </Typography>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="excerpt">Excerpt</CustomFormLabel>
            <CustomTextField
              id="excerpt"
              name="excerpt"
              multiline
              rows={4}
              value={customPage.excerpt}
              onChange={handleInputChange}
              placeholder="A short summary of the custom page."
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="body">Body</CustomFormLabel>
            <Paper
              variant="outlined"
              sx={{
                border: `1px solid ${borderColor}`,
                "& .ql-toolbar": {
                  borderBottom: `1px solid ${borderColor}`,
                  bgcolor: 'primary.light',
                  borderRadius: '4px 4px 0 0'
                },
                "& .ql-container": {
                  minHeight: 250,
                  borderRadius: '0 0 4px 4px'
                },
              }}
            >
              <ReactQuill
                value={customPage.body}
                onChange={(value) => setCustomPage({ ...customPage, body: value })}
                placeholder="The main content of the custom page..."
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline"],
                    [{ color: [] }, { background: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
                    ["link"],
                  ],
                }}
                formats={[
                  "header",
                  "bold",
                  "italic",
                  "underline",
                  "color",
                  "background",
                  "list",
                  "bullet",
                  "indent",
                  "align",
                  "link",
                ]}
              />
            </Paper>
            <Box sx={{ mt: 2 }}>
              <CustomFormLabel>Live Preview</CustomFormLabel>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  minHeight: 100,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '4px',
                  '& .ql-editor': {
                    padding: 0,
                  }
                }}
              >
                <div
                  className="ql-editor"
                  dangerouslySetInnerHTML={{ __html: customPage.body }}
                />
              </Paper>
            </Box>
        </Grid>
        </Grid>
          
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ mr: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
        <Button variant="text" color="error" onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </Box>
      </Box>
    </BlankCard>
  );
};

export default CreateCasinoCustom;