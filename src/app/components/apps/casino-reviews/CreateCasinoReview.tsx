import React, { useState, ComponentProps, ChangeEvent, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Paper,
  Button,
  IconButton,
  Grid,
  FormControlLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Divider,
  Stack,
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import { IconPlus, IconMinus } from '@tabler/icons-react';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { createCasino, fetchCasinoReviewData } from '@/store/apps/casinoReview/casinoSlice';
import { toast } from 'react-toastify';
import BlankCard from '../../shared/BlankCard';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Rich Text Editor Component
const RichTextEditor = (props: ComponentProps<typeof CustomTextField>) => (
  <CustomTextField multiline rows={6} {...props} />
);

// File Upload Components
const ImageUpload = ({
  label,
  id,
  onChange,
}: {
  label: string;
  id: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <Box>
    <CustomFormLabel htmlFor={id}>{label}</CustomFormLabel>
    <Box>
      <Button id={id} variant="outlined" component="label">
        Upload File
        <input type="file" name={id} hidden accept="image/*" onChange={onChange} />
      </Button>
    </Box>
  </Box>
);

const MultiImageUpload = ({
  label,
  id,
  onChange,
}: {
  label: string;
  id: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <Box>
    <CustomFormLabel htmlFor={id}>{label}</CustomFormLabel>
    <Box>
      <Button id={id} variant="outlined" component="label">
        Upload Files
        <input type="file" name={id} hidden multiple accept="image/*" onChange={onChange} />
      </Button>
    </Box>
  </Box>
);

// Interface Definitions
interface FaqItem {
  question: string;
  answer: string;
}

interface CasinoReviewData {
  id: number | null;
  name: string;
  slug: string;
  rating: number | string;
  tags: string[];
  casinoUrl: string;
  pros: string;
  cons: string;
  languages: string[];
  dateEstablished: number | string;
  licences: string[];
  casinoType: string[];
  affiliateProgram: string;
  company: string;
  countries: string[];
  depositMethods: string[];
  withdrawalMethods: string[];
  withdrawalTimes: string;
  withdrawalLimits: string;
  softwareProviders: string[];
  gameTypes: string[];
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  body: string;
  faq: FaqItem[];
  liveChat: boolean;
  phone: string;
  email: string;
  depositLimit: boolean;
  selfExclusion: boolean;
  withdrawal: boolean;
  featured: boolean;
  reviewer: string | null;
}

const casinoTypes: string[] = [
  'Live Casino',
  'Mobile Casino',
  'New Casino',
  'Minimum Deposit Casino',
  'No Wagering Casino',
  'Pay N Play Casino',
  'Sports Betting',
  'Crypto Casino',
  'Betting Sites',
  'Casino App',
  'eSports Betting',
  'Fast Payout Casino',
  'No Account Casino',
  'No Deposit Casino',
  'Low Wagering Casino',
  'New Online Casino',
  'Real Money Casino',
  'Welcome Bonus Casino',
  'Minimum Withdrawal Casino',
  'Best Payout Casino',
  'Same Day Payout Casino',
  'Instant Withdrawal Casino',
  'Fast Withdrawal Casino',
  'Best Online Casino',
  'Top Online Casino',
  'New Casino Sites',
  'Online Casino',
  'Online Casino Games',
  'Online Slots',
  'Online Roulette',
  'Online Blackjack',
  'Online Baccarat',
  'Online Poker',
  'Online Bingo',
  'Online Keno',
  'Online Scratch Cards',
  'Online Craps',
  'Online Sic Bo',
  'Online Pai Gow Poker',
  'Online Caribbean Stud Poker',
  'Online Three Card Poker',
  'Online Video Poker',
  'Online Live Dealer Casino',
  'Online Mobile Casino',
  'Online New Casino',
  'Online Minimum Deposit Casino',
  'Online No Wagering Casino',
  'Online Pay N Play Casino',
  'Online Sports Betting',
  'Online Crypto Casino',
  'Online Betting Sites',
  'Online Casino App',
  'Online eSports Betting',
  'Online Fast Payout Casino',
  'Online No Account Casino',
  'Online No Deposit Casino',
  'Online Low Wagering Casino',
  'Online New Online Casino',
  'Online Real Money Casino',
  'Online Welcome Bonus Casino',
  'Online Minimum Withdrawal Casino',
  'Online Best Payout Casino',
  'Online Same Day Payout Casino',
  'Online Instant Withdrawal Casino',
  'Online Fast Withdrawal Casino',
  'Online Best Online Casino',
  'Online Top Online Casino',
  'Online New Casino Sites',
];

const initialReviewState: CasinoReviewData = {
  id: null,
  name: '',
  slug: '',
  rating: '',
  tags: [],
  casinoUrl: '',
  pros: '',
  cons: '',
  languages: [],
  dateEstablished: '',
  licences: [],
  casinoType: [],
  affiliateProgram: '',
  company: '',
  countries: [],
  depositMethods: [],
  withdrawalMethods: [],
  withdrawalTimes: '',
  withdrawalLimits: '',
  softwareProviders: [],
  gameTypes: [],
  seoTitle: '',
  metaDescription: '',
  excerpt: '',
  body: '',
  faq: [],
  liveChat: false,
  phone: '',
  email: '',
  depositLimit: false,
  selfExclusion: false,
  withdrawal: false,
  featured: false,
  reviewer: null,
};

// Main Component
const CreateCasinoReview = () => {
  const theme = useTheme();
  const borderColor = theme.palette.divider;
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { isLoading, reviewData } = useSelector((state: RootState) => state.casinos);
  const [review, setReview] = useState<CasinoReviewData>(initialReviewState);
  const [featuredLogo, setFeaturedLogo] = useState<File | null>(null);
  const [screenshots, setScreenshots] = useState<FileList | null>(null);
  const primaryLight = theme.palette.primary.light;
  const [featuredLogoPreview, setFeaturedLogoPreview] = useState<string | null>(null);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
  const [countrySearch, setCountrySearch] = useState('');
  const filteredCountries = reviewData?.countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  useEffect(() => {
    dispatch(fetchCasinoReviewData());
    // Cleanup object URLs on unmount
    return () => {
      if (featuredLogoPreview) {
        URL.revokeObjectURL(featuredLogoPreview);
      }
      screenshotPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [dispatch, featuredLogoPreview, screenshotPreviews]);

  // Input Handlers
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;

    if (name === 'name' && !review.slug) {
      const newSlug = value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      setReview({ ...review, [name]: value, slug: newSlug });
    } else if (name === 'rating') {
      const numValue = parseFloat(value);
      setReview({
        ...review,
        [name]: numValue < 0 ? 0 : (numValue > 5.0 ? 5.0 : numValue),
      });
    } else if (name === 'dateEstablished') {
      const currentYear = new Date().getFullYear();
      const numValue = parseInt(value, 10);
      setReview({
        ...review,
        [name]: numValue > currentYear ? currentYear : numValue,
      });
    } else {
      setReview({
        ...review,
        [name]: type === 'checkbox' || type === 'switch' ? checked : value,
      });
    }
  };

  const handleMultiSelectChange = (event: SelectChangeEvent<string[]>, name: keyof CasinoReviewData) => {
    const {
      target: { value },
    } = event;
    let newValues: string[] = [];

    if (typeof value === 'string') {
      newValues = value.split(',');
    } else {
      newValues = value;
    }

    if (newValues.includes('select-all') && reviewData) {
      switch (name) {
        case 'languages':
          setReview({ ...review, [name]: reviewData.languages.map((item) => item._id) });
          break;
        case 'licences':
          setReview({ ...review, [name]: reviewData.licences.map((item) => item._id) });
          break;
        case 'casinoType':
          setReview({ ...review, [name]: casinoTypes });
          break;
        case 'countries':
          setReview({ ...review, [name]: reviewData.countries.map((item) => item._id) });
          break;
        case 'depositMethods':
          setReview({ ...review, [name]: reviewData.paymentMethods.map((item) => item._id) });
          break;
        case 'withdrawalMethods':
          setReview({ ...review, [name]: reviewData.paymentMethods.map((item) => item._id) });
          break;
        case 'softwareProviders':
          setReview({ ...review, [name]: reviewData.softwareProviders.map((item) => item._id) });
          break;
        case 'gameTypes':
          setReview({ ...review, [name]: reviewData.gameTypes.map((item) => item._id) });
          break;
        case 'tags':
          setReview({ ...review, [name]: reviewData.casinoTags.map((item) => item._id) });
          break;
        default:
          setReview({ ...review, [name]: newValues.filter((val) => val !== 'select-all') });
          break;
      }
    } else {
      setReview({ ...review, [name]: newValues });
    }
  };

  const handleFaqChange = (index: number, field: keyof FaqItem, value: string) => {
    const newFaq = [...review.faq];
    newFaq[index] = { ...newFaq[index], [field]: value };
    setReview({ ...review, faq: newFaq });
  };

  const addFaq = () => setReview({ ...review, faq: [...review.faq, { question: '', answer: '' }] });
  const removeFaq = (index: number) => {
    const newFaq = [...review.faq];
    newFaq.splice(index, 1);
    setReview({ ...review, faq: newFaq });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      if (name === 'featuredLogo') {
        const file = files[0];
        setFeaturedLogo(file);
        setFeaturedLogoPreview(URL.createObjectURL(file));
        toast.info(`Selected logo: ${file.name}`);
      } else if (name === 'screenshotsGallery') {
        setScreenshots(files);
        const newPreviews = Array.from(files).map((file) => URL.createObjectURL(file));
        setScreenshotPreviews(newPreviews);
        toast.info(`${files.length} screenshots selected.`);
      }
    }
  };

  const handleCancel = () => router.push('/content/casino-reviews');

  const handleSave = () => {
    // Client-side validation
    if (!review.name || !review.casinoUrl) {
      toast.error('Casino Name and Casino URL are required fields.');
      return;
    }
    if (!featuredLogo) {
      toast.error('A Featured Logo is required.');
      return;
    }

    // Create FormData for submission
    const submissionData = new FormData();
    submissionData.append('name', review.name);
    submissionData.append('casinoUrl', review.casinoUrl);
    submissionData.append('rating', String(review.rating));
    submissionData.append('affiliateProgram', review.affiliateProgram);
    submissionData.append('company', review.company);
    if (review.reviewer) {
      submissionData.append('reviewer', review.reviewer);
    }
    review.withdrawalTimes.split('\n').forEach((item) => submissionData.append('withdrawalTimes[]', item));
    review.withdrawalLimits.split('\n').forEach((item) => submissionData.append('withdrawalLimits[]', item));
    submissionData.append('seoTitle', review.seoTitle);
    submissionData.append('metaDescription', review.metaDescription);
    submissionData.append('excerpt', review.excerpt);
    submissionData.append('body', review.body);
    submissionData.append('isFeatured', String(review.featured));

    // Append array fields with _id values
    review.pros.split('\n').forEach((p) => submissionData.append('pros[]', p));
    review.cons.split('\n').forEach((c) => submissionData.append('cons[]', c));
    review.languages.forEach((id) => submissionData.append('languages[]', id));
    review.licences.forEach((id) => submissionData.append('licences[]', id));
    review.casinoType.forEach((id) => submissionData.append('casinoType[]', id));
    review.countries.forEach((id) => submissionData.append('restrictedCountries[]', id));
    review.depositMethods.forEach((id) => submissionData.append('depositMethods[]', id));
    review.withdrawalMethods.forEach((id) => submissionData.append('withdrawalMethods[]', id));
    review.softwareProviders.forEach((id) => submissionData.append('softwareProviders[]', id));
    review.gameTypes.forEach((id) => submissionData.append('gameTypes[]', id));
    review.tags.forEach((id) => submissionData.append('tags[]', id));

    // Append FAQ
    review.faq.forEach((faqItem, index) => {
      submissionData.append(`faq[${index}][question]`, faqItem.question);
      submissionData.append(`faq[${index}][answer]`, faqItem.answer);
    });

    // Append customer support and responsible gambling
    submissionData.append('customerSupport[liveChat]', String(review.liveChat));
    submissionData.append('customerSupport[phone]', review.phone);
    submissionData.append('customerSupport[email]', review.email);
    submissionData.append('responsibleGambling[depositLimit]', String(review.depositLimit));
    submissionData.append('responsibleGambling[selfExclusion]', String(review.selfExclusion));
    submissionData.append('responsibleGambling[withdrawal]', String(review.withdrawal));

    // Append files
    if (featuredLogo) submissionData.append('featuredLogo', featuredLogo);
    if (screenshots) {
      Array.from(screenshots).forEach((file) => {
        submissionData.append('screenshots', file);
      });
    }

    // Dispatch action
    dispatch(createCasino(submissionData)).then((result) => {
      if (createCasino.fulfilled.match(result)) {
        router.push('/content/casino-reviews');
      }
    });
  };

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
        <Typography variant="h6" fontWeight={600} fontSize={18}>
          Create New Casino
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        {/* General Section */}
        <Paper variant="outlined" sx={{ mb: 3, border: `1px solid ${borderColor}` }}>
          <Typography variant="h6" fontWeight={600} sx={{ bgcolor: primaryLight, p: 2, borderRadius: '4px' }}>
            General
          </Typography>
          <Grid container spacing={3} p={3}>
            <Grid item xs={12} sm={12}>
              <CustomFormLabel htmlFor="name">Casino Name</CustomFormLabel>
              <CustomTextField
                id="name"
                name="name"
                value={review.name}
                onChange={handleInputChange}
                placeholder="Grand Fortune Casino"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="casinoURL">Casino URL</CustomFormLabel>
              <CustomTextField
                id="casinoURL"
                name="casinoUrl"
                type="url"
                value={review.casinoUrl}
                onChange={handleInputChange}
                placeholder="https://example.com"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="rating">Rating (1-5)</CustomFormLabel>
              <CustomTextField
                id="rating"
                name="rating"
                type="number"
                value={review.rating}
                onChange={handleInputChange}
                placeholder="4.5"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="pros">Pros (one per line)</CustomFormLabel>
              <CustomTextField
                id="pros"
                name="pros"
                multiline
                rows={4}
                value={review.pros}
                onChange={handleInputChange}
                placeholder="Fast payouts\nGreat game selection"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="cons">Cons (one per line)</CustomFormLabel>
              <CustomTextField
                id="cons"
                name="cons"
                multiline
                rows={4}
                value={review.cons}
                onChange={handleInputChange}
                placeholder="Limited support hours"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="languages">Languages</CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="languages-label">Select Languages</InputLabel>
                <Select
                  labelId="languages-label"
                  id="languages"
                  multiple
                  name="languages"
                  value={review.languages}
                  onChange={(e) => handleMultiSelectChange(e, 'languages')}
                  input={<OutlinedInput label="Select Languages" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((id) => {
                        const language = reviewData?.languages.find((lang) => lang._id === id);
                        return <Chip key={id} label={language?.name || id} />;
                      })}
                    </Box>
                  )}
                >
                  <MenuItem value="select-all">Select All</MenuItem>
                  {reviewData?.languages.map((lang) => (
                    <MenuItem key={lang._id} value={lang._id}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="dateEstablished">Date Established (Year)</CustomFormLabel>
              <CustomTextField
                id="dateEstablished"
                name="dateEstablished"
                type="number"
                value={review.dateEstablished}
                onChange={handleInputChange}
                placeholder="2025"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="licences">Licences</CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="licences-label">Select Licences</InputLabel>
                <Select
                  labelId="licences-label"
                  id="licences"
                  multiple
                  name="licences"
                  value={review.licences}
                  onChange={(e) => handleMultiSelectChange(e, 'licences')}
                  input={<OutlinedInput label="Select Licences" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((id) => {
                        const licence = reviewData?.licences.find((lic) => lic._id === id);
                        return <Chip key={id} label={licence?.name || id} />;
                      })}
                    </Box>
                  )}
                >
                  <MenuItem value="select-all">Select All</MenuItem>
                  {reviewData?.licences.map((lic) => (
                    <MenuItem key={lic._id} value={lic._id}>
                      {lic.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="casinoType">Casino Type</CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="casinoType-label">Select Casino Types</InputLabel>
                <Select
                  labelId="casinoType-label"
                  id="casinoType"
                  multiple
                  name="casinoType"
                  value={review.casinoType}
                  onChange={(e) => handleMultiSelectChange(e, 'casinoType')}
                  input={<OutlinedInput label="Select Casino Types" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="select-all">Select All</MenuItem>
                  {casinoTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="affiliateProgram">Affiliate Program</CustomFormLabel>
              <CustomTextField
                id="affiliateProgram"
                name="affiliateProgram"
                value={review.affiliateProgram}
                onChange={handleInputChange}
                placeholder="Casino Partners"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="company">Company</CustomFormLabel>
              <CustomTextField
                id="company"
                name="company"
                value={review.company}
                onChange={handleInputChange}
                placeholder="Gaming Corp."
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="reviewer">Reviewer</CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="reviewer-label">Select Reviewer</InputLabel>
                <Select
                  labelId="reviewer-label"
                  id="reviewer"
                  name="reviewer"
                  value={review.reviewer || ''}
                  onChange={(e: SelectChangeEvent<string>) => setReview({ ...review, reviewer: e.target.value === '' ? null : e.target.value })}
                  input={<OutlinedInput label="Select Reviewer" />}
                >
                  <MenuItem value="">None</MenuItem>
                  {reviewData?.reviewers.map((reviewer) => (
                    <MenuItem key={reviewer._id} value={reviewer._id}>
                      {reviewer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="countries">Restricted Countries</CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="countries-label">Select Restricted Countries</InputLabel>
                <Select
                  labelId="countries-label"
                  id="countries"
                  multiple
                  name="countries"
                  value={review.countries}
                  onChange={(e) => handleMultiSelectChange(e, 'countries')}
                  input={<OutlinedInput label="Select Countries" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((id) => {
                        const country = reviewData?.countries.find((c) => c._id === id);
                        return <Chip key={id} label={country?.name || id} />;
                      })}
                    </Box>
                  )}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 224,
                        width: 250,
                      },
                    },
                  }}
                >
                  <Box sx={{ p: 1 }}>
                    <CustomTextField
                      fullWidth
                      variant="outlined"
                      placeholder="Search..."
                      onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCountrySearch(e.target.value)}
                      onKeyDown={(e: { stopPropagation: () => any; }) => e.stopPropagation()} // Prevent closing the menu
                    />
                  </Box>
                  <MenuItem value="select-all">Select All</MenuItem>
                  {filteredCountries?.map((country) => (
                    <MenuItem key={country._id} value={country._id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Payments Section */}
        <Paper variant="outlined" sx={{ mb: 3, border: `1px solid ${borderColor}` }}>
          <Typography variant="h6" fontWeight={600} sx={{ bgcolor: primaryLight, p: 2, borderRadius: '4px' }}>
            Payments
          </Typography>
          <Grid container spacing={3} p={3}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="depositMethods">Deposit Methods</CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="depositMethods-label">Select Deposit Methods</InputLabel>
                <Select
                  labelId="depositMethods-label"
                  id="depositMethods"
                  multiple
                  name="depositMethods"
                  value={review.depositMethods}
                  onChange={(e) => handleMultiSelectChange(e, 'depositMethods')}
                  input={<OutlinedInput label="Select Deposit Methods" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((id) => {
                        const method = reviewData?.paymentMethods.find((m) => m._id === id);
                        return <Chip key={id} label={String(method?.methods || id)} />;
                      })}
                    </Box>
                  )}
                >
                  <MenuItem value="select-all">Select All</MenuItem>
                  {reviewData?.paymentMethods.map((method) => (
                    <MenuItem key={method._id} value={method._id}>
                      {method.methods}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="withdrawalMethods">Withdrawal Methods</CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="withdrawalMethods-label">Select Withdrawal Methods</InputLabel>
                <Select
                  labelId="withdrawalMethods-label"
                  id="withdrawalMethods"
                  multiple
                  name="withdrawalMethods"
                  value={review.withdrawalMethods}
                  onChange={(e) => handleMultiSelectChange(e, 'withdrawalMethods')}
                  input={<OutlinedInput label="Select Withdrawal Methods" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((id) => {
                        const method = reviewData?.paymentMethods.find((m) => m._id === id);
                        return <Chip key={id} label={String(method?.methods || id)} />;
                      })}
                    </Box>
                  )}
                >
                  <MenuItem value="select-all">Select All</MenuItem>
                  {reviewData?.paymentMethods.map((method) => (
                    <MenuItem key={method._id} value={method._id}>
                      {method.methods}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="withdrawalTimes">Withdrawal Times (one per line)</CustomFormLabel>
              <CustomTextField
                id="withdrawalTimes"
                name="withdrawalTimes"
                value={review.withdrawalTimes}
                onChange={handleInputChange}
                placeholder="1-3 business days, Instant for e-wallets"
                multiline
                rows={4}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="withdrawalLimits">Withdrawal Limits (one per line)</CustomFormLabel>
              <CustomTextField
                id="withdrawalLimits"
                name="withdrawalLimits"
                value={review.withdrawalLimits}
                onChange={handleInputChange}
                placeholder="$5000 per week, $20000 per month"
                multiline
                rows={4}
                fullWidth
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Games Section */}
        <Paper variant="outlined" sx={{ mb: 3, border: `1px solid ${borderColor}` }}>
          <Typography variant="h6" fontWeight={600} sx={{ bgcolor: primaryLight, p: 2, borderRadius: '4px' }}>
            Games
          </Typography>
          <Grid container spacing={3} p={3}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="softwareProviders">Software Providers</CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="softwareProviders-label">Select Providers</InputLabel>
                <Select
                  labelId="softwareProviders-label"
                  id="softwareProviders"
                  multiple
                  name="softwareProviders"
                  value={review.softwareProviders}
                  onChange={(e) => handleMultiSelectChange(e, 'softwareProviders')}
                  input={<OutlinedInput label="Select Providers" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((id) => {
                        const provider = reviewData?.softwareProviders.find((p) => p._id === id);
                        return <Chip key={id} label={provider?.name || id} />;
                      })}
                    </Box>
                  )}
                >
                  <MenuItem value="select-all">Select All</MenuItem>
                  {reviewData?.softwareProviders.map((provider) => (
                    <MenuItem key={provider._id} value={provider._id}>
                      {provider.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="gameTypes">Game Types</CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="gameTypes-label">Select Game Types</InputLabel>
                <Select
                  labelId="gameTypes-label"
                  id="gameTypes"
                  multiple
                  name="gameTypes"
                  value={review.gameTypes}
                  onChange={(e) => handleMultiSelectChange(e, 'gameTypes')}
                  input={<OutlinedInput label="Select Game Types" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((id) => {
                        const type = reviewData?.gameTypes.find((t) => t._id === id);
                        return <Chip key={id} label={type?.name || id} />;
                      })}
                    </Box>
                  )}
                >
                  <MenuItem value="select-all">Select All</MenuItem>
                  {reviewData?.gameTypes.map((type) => (
                    <MenuItem key={type._id} value={type._id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Content Section */}
        <Paper variant="outlined" sx={{ mb: 3, border: `1px solid ${borderColor}` }}>
          <Typography variant="h6" fontWeight={600} sx={{ bgcolor: primaryLight, p: 2, borderRadius: '4px' }}>
            Content
          </Typography>
          <Grid container spacing={3} p={3}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="seoTitle">SEO Title</CustomFormLabel>
              <CustomTextField
                id="seoTitle"
                name="seoTitle"
                value={review.seoTitle}
                onChange={handleInputChange}
                placeholder="Best Casino Review 2025"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="metaDescription">Meta Description</CustomFormLabel>
              <CustomTextField
                id="metaDescription"
                name="metaDescription"
                value={review.metaDescription}
                onChange={handleInputChange}
                placeholder="A short and engaging description for search engines."
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ImageUpload id="featuredLogo" label="Featured Logo" onChange={handleFileChange} />
              {featuredLogoPreview && (
                <img
                  src={featuredLogoPreview}
                  alt="Featured Logo Preview"
                  width="100"
                  style={{ marginTop: '10px', borderRadius: '10px' }}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <MultiImageUpload id="screenshotsGallery" label="Screenshots Gallery" onChange={handleFileChange} />
              <Stack direction="row" spacing={1} sx={{ mt: 1, overflowX: 'auto', flexWrap: 'nowrap' }}>
                {screenshotPreviews.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Screenshot Preview ${index + 1}`}
                    width="100"
                    style={{ marginTop: '10px', borderRadius: '10px' }}
                  />
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="excerpt">Excerpt</CustomFormLabel>
              <CustomTextField
                id="excerpt"
                name="excerpt"
                multiline
                rows={4}
                value={review.excerpt}
                onChange={handleInputChange}
                placeholder="A short summary of the review."
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="body">Body</CustomFormLabel>
              <Paper
                variant="outlined"
                sx={{
                  border: `1px solid ${borderColor}`,
                  '& .ql-toolbar': {
                    borderBottom: `1px solid ${borderColor}`,
                    bgcolor: 'primary.light',
                    borderRadius: '4px 4px 0 0',
                  },
                  '& .ql-container': {
                    minHeight: 250,
                    borderRadius: '0 0 4px 4px',
                  },
                }}
              >
                <ReactQuill
                  value={review.body}
                  onChange={(value) => setReview({ ...review, body: value })}
                  placeholder="The main content of the review..."
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      ['bold', 'italic', 'underline'],
                      [{ color: [] }, { background: [] }],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      [{ indent: '-1' }, { indent: '+1' }, { align: [] }],
                      ['link'],
                    ],
                  }}
                  formats={['header', 'bold', 'italic', 'underline', 'color', 'background', 'list', 'bullet', 'indent', 'align', 'link']}
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
                    },
                  }}
                >
                  <div className="ql-editor" dangerouslySetInnerHTML={{ __html: review.body || '' }} />
                </Paper>
              </Box>
              <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="tags">Tags</CustomFormLabel>
                <FormControl fullWidth>
                  <InputLabel id="tags-label">Select Tags</InputLabel>
                  <Select
                    labelId="tags-label"
                    id="tags"
                    multiple
                    name="tags"
                    value={review.tags}
                    onChange={(e) => handleMultiSelectChange(e, 'tags')}
                    input={<OutlinedInput label="Select Tags" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((id) => {
                          const tag = reviewData?.casinoTags.find((t) => t._id === id);
                          return <Chip key={id} label={tag?.name || id} />;
                        })}
                      </Box>
                    )}
                  >
                    <MenuItem value="select-all">Select All</MenuItem>
                    {reviewData?.casinoTags.map((tag) => (
                      <MenuItem key={tag._id} value={tag._id}>
                        {tag.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomFormLabel>Featured?</CustomFormLabel>
                <Box>
                  <FormControlLabel
                    control={
                      <CustomSwitch
                        id="featured"
                        name="featured"
                        checked={review.featured}
                        onChange={handleInputChange}
                      />
                    }
                    label={review.featured ? 'Yes' : 'No'}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <CustomFormLabel>FAQ</CustomFormLabel>
                <Box>
                  {review.faq.map((faqItem, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 2,
                        border: `1px solid ${borderColor}`,
                        p: 2,
                        borderRadius: '4px',
                      }}
                    >
                      <CustomTextField
                        fullWidth
                        label="Question"
                        variant="outlined"
                        value={faqItem.question}
                        onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          handleFaqChange(index, 'question', e.target.value)
                        }
                        sx={{ mb: 1 }}
                        placeholder={`Question #${index + 1}`}
                      />
                      <CustomTextField
                        fullWidth
                        label="Answer"
                        variant="outlined"
                        multiline
                        rows={2}
                        value={faqItem.answer}
                        onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          handleFaqChange(index, 'answer', e.target.value)
                        }
                        placeholder={`Answer #${index + 1}`}
                      />
                      <IconButton onClick={() => removeFaq(index)} color="error" sx={{ mt: 1 }}>
                        <IconMinus />
                      </IconButton>
                    </Box>
                  ))}
                  <Button startIcon={<IconPlus />} onClick={addFaq} variant="outlined">
                    Add FAQ
                  </Button>
                </Box>
              </Grid>
            </Grid>
            </Grid>
          </Paper>

          {/* Customer Support Section */}
          <Paper variant="outlined" sx={{ mb: 3, border: `1px solid ${borderColor}` }}>
            <Typography variant="h6" fontWeight={600} sx={{ bgcolor: primaryLight, p: 2, borderRadius: '4px' }}>
              Customer Support
            </Typography>
            <Grid container spacing={3} p={3}>
              <Grid item xs={12} sm={4}>
                <CustomFormLabel>Live Chat Available</CustomFormLabel>
                <Box>
                  <FormControlLabel
                    control={
                      <CustomSwitch
                        id="liveChat"
                        name="liveChat"
                        checked={review.liveChat}
                        onChange={handleInputChange}
                      />
                    }
                    label={review.liveChat ? 'Yes' : 'No'}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomFormLabel htmlFor="phone">Phone</CustomFormLabel>
                <CustomTextField
                  id="phone"
                  name="phone"
                  value={review.phone}
                  onChange={handleInputChange}
                  placeholder="1-800-555-1234"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
                <CustomTextField
                  id="email"
                  name="email"
                  type="email"
                  value={review.email}
                  onChange={handleInputChange}
                  placeholder="support@example.com"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Responsible Gambling Section */}
          <Paper variant="outlined" sx={{ mb: 3, border: `1px solid ${borderColor}` }}>
            <Typography variant="h6" fontWeight={600} sx={{ bgcolor: primaryLight, p: 2, borderRadius: '4px' }}>
              Responsible Gambling
            </Typography>
            <Grid container spacing={3} p={3}>
              <Grid item xs={12} sm={4}>
                <CustomFormLabel>Deposit Limit</CustomFormLabel>
                <Box>
                  <FormControlLabel
                    control={
                      <CustomSwitch
                        id="depositLimit"
                        name="depositLimit"
                        checked={review.depositLimit}
                        onChange={handleInputChange}
                      />
                    }
                    label={review.depositLimit ? 'Yes' : 'No'}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomFormLabel>Self-Exclusion</CustomFormLabel>
                <Box>
                  <FormControlLabel
                    control={
                      <CustomSwitch
                        id="selfExclusion"
                        name="selfExclusion"
                        checked={review.selfExclusion}
                        onChange={handleInputChange}
                      />
                    }
                    label={review.selfExclusion ? 'Yes' : 'No'}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomFormLabel>Withdrawal</CustomFormLabel>
                <Box>
                  <FormControlLabel
                    control={
                      <CustomSwitch
                        id="withdrawal"
                        name="withdrawal"
                        checked={review.withdrawal}
                        onChange={handleInputChange}
                      />
                    }
                    label={review.withdrawal ? 'Yes' : 'No'}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
            <Button variant="text" color="error" onClick={handleCancel}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </BlankCard>
    );
};

export default CreateCasinoReview;