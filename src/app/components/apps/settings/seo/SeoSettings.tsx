import React,{ useState ,SetStateAction} from 'react';
import {
  Button,
  Grid,
  MenuItem,
  Stack,
  CardContent,
  Box,
  Typography,
} from '@mui/material';

// components
import BlankCard from '@/app/components/shared/BlankCard';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import { useTheme } from '@mui/material';

const sitemapFrequencies = [
  { value: 'always', label: 'Always' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'never', label: 'Never' },
];

const SeoSettings = () => {
  const [globalMetaKeywords, setGlobalMetaKeywords] = useState('');
  const [globalMetaDescription, setGlobalMetaDescription] = useState('');
  const [defaultMetaTitleTemplate, setDefaultMetaTitleTemplate] = useState('{page_title} | Site Name');
  const [defaultMetaDescriptionTemplate, setDefaultMetaDescriptionTemplate] = useState('{page_description}');
  const [enableSitemapGeneration, setEnableSitemapGeneration] = useState(true);
  const [includePagesInSitemap, setIncludePagesInSitemap] = useState(true);
  const [includeBlogPostsInSitemap, setIncludeBlogPostsInSitemap] = useState(true);
  const [sitemapFrequency, setSitemapFrequency] = useState('daily');
  const [sitemapPriority, setSitemapPriority] = useState('0.8');
   const theme = useTheme();
  const primaryLight = theme.palette.primary.light;

  const handleSave = () => {
    console.log('Saving SEO Settings:', {
      globalMetaKeywords,
      globalMetaDescription,
      defaultMetaTitleTemplate,
      defaultMetaDescriptionTemplate,
      enableSitemapGeneration,
      includePagesInSitemap,
      includeBlogPostsInSitemap,
      sitemapFrequency,
      sitemapPriority,
    });
    // Implement API call to save settings
  };

  const handleCancel = () => {
    // Reset to initial state or fetch from backend
    setGlobalMetaKeywords('');
    setGlobalMetaDescription('');
    setDefaultMetaTitleTemplate('{page_title} | Site Name');
    setDefaultMetaDescriptionTemplate('{page_description}');
    setEnableSitemapGeneration(true);
    setIncludePagesInSitemap(true);
    setIncludeBlogPostsInSitemap(true);
    setSitemapFrequency('daily');
    setSitemapPriority('0.8');
  };

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
            <Typography variant="h6" fontWeight={600} fontSize={18}>
              Seo Settings
            </Typography>
          </Box>
    <Box sx={{ p: 2 }}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <BlankCard>
          <CardContent>
            
            <form>
              <Grid container spacing={3}>
                {/* Global Meta Tags */}
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="global-meta-keywords">
                    Global Meta Keywords
                  </CustomFormLabel>
                  <CustomTextField
                    id="global-meta-keywords"
                    value={globalMetaKeywords}
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setGlobalMetaKeywords(e.target.value)}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="e.g., casino, online gambling, slots"
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="global-meta-description">
                    Global Meta Description
                  </CustomFormLabel>
                  <CustomTextField
                    id="global-meta-description"
                    value={globalMetaDescription}
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setGlobalMetaDescription(e.target.value)}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="e.g., Discover the best online casinos and games."
                  />
                </Grid>

                {/* Default Templates */}
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="default-meta-title-template">
                    Default Meta Title Template
                  </CustomFormLabel>
                  <CustomTextField
                    id="default-meta-title-template"
                    value={defaultMetaTitleTemplate}
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setDefaultMetaTitleTemplate(e.target.value)}
                    variant="outlined"
                    fullWidth
                    placeholder="e.g., {page_title} | Your Site Name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="default-meta-description-template">
                    Default Meta Description Template
                  </CustomFormLabel>
                  <CustomTextField
                    id="default-meta-description-template"
                    value={defaultMetaDescriptionTemplate}
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setDefaultMetaDescriptionTemplate(e.target.value)}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="e.g., {page_description} - Find out more."
                  />
                </Grid>

                {/* XML Sitemap */}
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CustomFormLabel htmlFor="enable-sitemap-generation">
                      Enable XML Sitemap Generation
                    </CustomFormLabel>
                    <CustomSwitch
                      id="enable-sitemap-generation"
                      checked={enableSitemapGeneration}
                      onChange={(e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => setEnableSitemapGeneration(e.target.checked)}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CustomFormLabel htmlFor="include-pages-in-sitemap">
                      Include Pages in Sitemap
                    </CustomFormLabel>
                    <CustomSwitch
                      id="include-pages-in-sitemap"
                      checked={includePagesInSitemap}
                      onChange={(e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => setIncludePagesInSitemap(e.target.checked)}
                      disabled={!enableSitemapGeneration}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CustomFormLabel htmlFor="include-blog-posts-in-sitemap">
                      Include Blog Posts in Sitemap
                    </CustomFormLabel>
                    <CustomSwitch
                      id="include-blog-posts-in-sitemap"
                      checked={includeBlogPostsInSitemap}
                      onChange={(e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => setIncludeBlogPostsInSitemap(e.target.checked)}
                      disabled={!enableSitemapGeneration}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel htmlFor="sitemap-frequency">
                    Sitemap Frequency
                  </CustomFormLabel>
                  <CustomSelect
                    fullWidth
                    id="sitemap-frequency"
                    name="sitemap-frequency"
                    value={sitemapFrequency}
                    onChange={(e: { target: { value: string; }; }) => setSitemapFrequency(e.target.value as string)}
                    disabled={!enableSitemapGeneration}
                  >
                    {sitemapFrequencies.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel htmlFor="sitemap-priority">
                    Sitemap Priority
                  </CustomFormLabel>
                  <CustomTextField
                    id="sitemap-priority"
                    value={sitemapPriority}
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setSitemapPriority(e.target.value)}
                    variant="outlined"
                    fullWidth
                    type="number"
                    inputProps={{ step: "0.1", min: "0.0", max: "1.0" }}
                    disabled={!enableSitemapGeneration}
                  />
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                      Save SEO Settings
                    </Button>
                    <Button variant="outlined" color="error" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </BlankCard>
      </Grid>
    </Grid>
    </Box>
    </BlankCard>
  );
};

export default SeoSettings;
