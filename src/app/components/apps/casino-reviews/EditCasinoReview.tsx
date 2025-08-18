"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
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
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import { toast } from "react-toastify";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSwitch from "@/app/components/forms/theme-elements/CustomSwitch";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateCasino } from "@/store/apps/casinoReview/casinoSlice";
import BlankCard from "../../shared/BlankCard";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Constant arrays matching schema enums
const casinoTypes: string[] = [
  "Live Casino",
  "Mobile Casino",
  "New Casino",
  "Minimum Deposit Casino",
  "No Wagering Casino",
  "Pay N Play Casino",
  "Sports Betting",
  "Crypto Casino",
  "Betting Sites",
  "Casino App",
  "eSports Betting",
  "Fast Payout Casino",
  "No Account Casino",
  "No Deposit Casino",
  "Low Wagering Casino",
  "New Online Casino",
  "Real Money Casino",
  "Welcome Bonus Casino",
  "Minimum Withdrawal Casino",
  "Best Payout Casino",
  "Same Day Payout Casino",
  "Instant Withdrawal Casino",
  "Fast Withdrawal Casino",
  "Best Online Casino",
  "Top Online Casino",
  "New Casino Sites",
  "Online Casino",
  "Online Casino Games",
  "Online Slots",
  "Online Roulette",
  "Online Blackjack",
  "Online Baccarat",
  "Online Poker",
  "Online Bingo",
  "Online Keno",
  "Online Scratch Cards",
  "Online Craps",
  "Online Sic Bo",
  "Online Pai Gow Poker",
  "Online Caribbean Stud Poker",
  "Online Three Card Poker",
  "Online Video Poker",
  "Online Live Dealer Casino",
  "Online Mobile Casino",
  "Online New Casino",
  "Online Minimum Deposit Casino",
  "Online No Wagering Casino",
  "Online Pay N Play Casino",
  "Online Sports Betting",
  "Online Crypto Casino",
  "Online Betting Sites",
  "Online Casino App",
  "Online eSports Betting",
  "Online Fast Payout Casino",
  "Online No Account Casino",
  "Online No Deposit Casino",
  "Online Low Wagering Casino",
  "Online New Online Casino",
  "Online Real Money Casino",
  "Online Welcome Bonus Casino",
  "Online Minimum Withdrawal Casino",
  "Online Best Payout Casino",
  "Online Same Day Payout Casino",
  "Online Instant Withdrawal Casino",
  "Online Fast Withdrawal Casino",
  "Online Best Online Casino",
  "Online Top Online Casino",
  "Online New Casino Sites",
];

// File Upload Components
interface ImageUploadProps {
  label: string;
  id: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ImageUpload = ({ label, id, onChange }: ImageUploadProps) => (
  <Box>
    <CustomFormLabel htmlFor={id}>{label}</CustomFormLabel>
    <Box>
      <Button id={id} variant="outlined" component="label">
        Upload File
        <input
          type="file"
          name={id}
          hidden
          accept="image/*"
          onChange={onChange}
        />
      </Button>
    </Box>
  </Box>
);

const MultiImageUpload = ({ label, id, onChange }: ImageUploadProps) => (
  <Box>
    <CustomFormLabel htmlFor={id}>{label}</CustomFormLabel>
    <Box>
      <Button id={id} variant="outlined" component="label">
        Upload Files
        <input
          type="file"
          name={id}
          hidden
          multiple
          accept="image/*"
          onChange={onChange}
        />
      </Button>
    </Box>
  </Box>
);

// Interface Definitions
interface FaqItem {
  question: string;
  answer: string;
  _id?: string;
}

interface CustomerSupport {
  liveChat: boolean;
  phone: string;
  email: string;
}

interface ResponsibleGambling {
  depositLimit: boolean;
  selfExclusion: boolean;
  withdrawal: boolean;
}

interface ReviewData {
  languages: { _id: string; name: string }[];
  licences: { _id: string; name: string }[];
  countries: { _id: string; name: string }[];
  paymentMethods: { _id: string; methods: string }[];
  softwareProviders: { _id: string; name: string }[];
  gameTypes: { _id: string; name: string }[];
  casinoTags: { _id: string; name: string }[];
  reviewers: { _id: string; name: string }[];
}

interface CasinoReviewData {
  _id: string;
  name: string;
  slug: string;
  casinoUrl: string;
  rating: number | string;
  pros: string[];
  cons: string[];
  languages: string[];
  dateEstablished: number | string;
  licences: string[];
  casinoType: string[];
  affiliateProgram: string;
  company: string;
  restrictedCountries: string[];
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
  tags: string[];
  isFeatured: boolean;
  faq: FaqItem[];
  customerSupport: CustomerSupport;
  responsibleGambling: ResponsibleGambling;
  featuredLogo?: string;
  screenshots?: string[];
  status: string;
  reviewer: {
    _id: string;
    name: string;
    email?: string;
  }[];
}

interface EditCasinoReviewProps {
  review: CasinoReviewData;
  reviewData: ReviewData | null;
}

const EditCasinoReview = ({
  review: initialReview,
  reviewData,
}: EditCasinoReviewProps) => {
  if (!reviewData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading data...</Typography>
      </Box>
    );
  }

  const theme = useTheme();
  const borderColor = theme.palette.divider;
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const primaryLight = theme.palette.primary.light;

  const [review, setReview] = useState<CasinoReviewData>(initialReview);
  const [prosText, setProsText] = useState<string>("");
  const [consText, setConsText] = useState<string>("");
  const [featuredLogo, setFeaturedLogo] = useState<File | null>(null);
  const [screenshots, setScreenshots] = useState<FileList | null>(null);
  const [removedFaqIds, setRemovedFaqIds] = useState<string[]>([]);
  const [featuredLogoPreview, setFeaturedLogoPreview] = useState<string | null>(
    null
  );
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
  const [countrySearch, setCountrySearch] = useState('');
  const filteredCountries = reviewData?.countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  useEffect(() => {
    return () => {
      if (featuredLogoPreview) {
        URL.revokeObjectURL(featuredLogoPreview);
      }
      screenshotPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [featuredLogoPreview, screenshotPreviews, initialReview, reviewData]);

  // Normalize array values to ensure they are strings
  const normalizeStringArray = (arr: any[] | undefined): string[] => {
    if (!Array.isArray(arr)) {
      return [];
    }
    return arr
      .map((item) => {
        if (typeof item === "object" && item !== null && "_id" in item) {
          return String(item._id);
        }
        return String(item);
      })
      .filter((id) => id !== undefined && id !== null && id !== '');
  };

  useEffect(() => {
    const normalizedReview: CasinoReviewData = {
      ...initialReview,
      _id: initialReview._id || "",
      name: initialReview.name || "",
      slug: initialReview.slug || "",
      casinoUrl: initialReview.casinoUrl || "",
      rating: initialReview.rating || "",
      pros: normalizeStringArray(initialReview.pros),
      cons: normalizeStringArray(initialReview.cons),
      languages: normalizeStringArray(
        initialReview.languages.length ? initialReview.languages : ["English"]
      ),
      dateEstablished: initialReview.dateEstablished || "",
      licences: normalizeStringArray(initialReview.licences),
      casinoType: normalizeStringArray(initialReview.casinoType),
      affiliateProgram: initialReview.affiliateProgram || "",
      company: initialReview.company || "",
      restrictedCountries: normalizeStringArray(
        initialReview.restrictedCountries
      ),
      depositMethods: normalizeStringArray(initialReview.depositMethods),
      withdrawalMethods: normalizeStringArray(initialReview.withdrawalMethods),
      withdrawalTimes: Array.isArray(initialReview.withdrawalTimes) ? initialReview.withdrawalTimes.join('\n') : '',
      withdrawalLimits: Array.isArray(initialReview.withdrawalLimits) ? initialReview.withdrawalLimits.join('\n') : '',
      softwareProviders: normalizeStringArray(initialReview.softwareProviders),
      gameTypes: normalizeStringArray(initialReview.gameTypes),
      seoTitle: initialReview.seoTitle || "",
      metaDescription: initialReview.metaDescription || "",
      excerpt: initialReview.excerpt || "",
      body: initialReview.body || "",
      tags: normalizeStringArray(initialReview.tags),
      isFeatured: initialReview.isFeatured || false,
      faq: Array.isArray(initialReview.faq) ? initialReview.faq : [],
      customerSupport: {
        liveChat: initialReview.customerSupport?.liveChat || false,
        phone: initialReview.customerSupport?.phone || "",
        email: initialReview.customerSupport?.email || "",
      },
      responsibleGambling: {
        depositLimit: initialReview.responsibleGambling?.depositLimit || false,
        selfExclusion:
          initialReview.responsibleGambling?.selfExclusion || false,
        withdrawal: initialReview.responsibleGambling?.withdrawal || false,
      },
      featuredLogo: initialReview.featuredLogo || "no-photo.jpg",
      screenshots: Array.isArray(initialReview.screenshots)
        ? initialReview.screenshots
        : [],
      status: initialReview.status || "enabled",
      reviewer: Array.isArray(initialReview.reviewer)
        ? initialReview.reviewer
        : [],
    };

    setReview(normalizedReview);
    setProsText(normalizedReview.pros.join("\n"));
    setConsText(normalizedReview.cons.join("\n"));
  }, [initialReview]);

  // Input Handlers
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;

    if (name === "pros") {
      setProsText(value);
      setReview({
        ...review,
        pros: value.split("\n").filter((p) => p.trim() !== ""),
      });
    } else if (name === "cons") {
      setConsText(value);
      setReview({
        ...review,
        cons: value.split("\n").filter((c) => c.trim() !== ""),
      });
    } else if (name === "name" && !review.slug) {
      const newSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setReview({ ...review, name: value, slug: newSlug });
    } else if (name === "liveChat" || name === "phone" || name === "email") {
      setReview({
        ...review,
        customerSupport: {
          ...review.customerSupport,
          [name]: type === "checkbox" ? checked : value,
        },
      });
    } else if (
      name === "depositLimit" ||
      name === "selfExclusion" ||
      name === "withdrawal"
    ) {
      setReview({
        ...review,
        responsibleGambling: {
          ...review.responsibleGambling,
          [name]: type === "checkbox" ? checked : value,
        },
      });
    } else if (name === "rating") {
      const numValue = parseFloat(value);
      setReview({
        ...review,
        [name]: numValue < 0 ? 0 : (numValue > 5.0 ? 5.0 : numValue),
      });
    } else if (name === "dateEstablished") {
      const currentYear = new Date().getFullYear();
      const numValue = parseInt(value, 10);
      setReview({
        ...review,
        [name]: numValue > currentYear ? currentYear : numValue,
      });
    } else if (name === "withdrawalTimes" || name === "withdrawalLimits") {
      setReview({
        ...review,
        [name]: value,
      });
    } else {
      setReview({
        ...review,
        [name]: type === "checkbox" || type === "switch" ? checked : value,
      });
    }
  };

  const handleMultiSelectChange = (
    event: SelectChangeEvent<string[]>,
    name: keyof CasinoReviewData
  ) => {
    const {
      target: { value },
    } = event;
    let newValues: string[] = [];

    if (typeof value === "string") {
      newValues = value.split(",").filter((val) => val.trim() !== "");
    } else {
      newValues = value;
    }

    if (newValues.includes("select-all")) {
      switch (name) {
        case "languages":
          setReview({
            ...review,
            [name]: reviewData.languages?.map((item: any) => item._id) || [],
          });
          break;
        case "licences":
          setReview({
            ...review,
            [name]: reviewData.licences?.map((item: any) => item._id) || [],
          });
          break;
        case "casinoType":
          setReview({ ...review, [name]: casinoTypes });
          break;
        case "restrictedCountries":
          setReview({
            ...review,
            [name]: reviewData.countries?.map((item: any) => item._id) || [],
          });
          break;
        case "depositMethods":
          setReview({
            ...review,
            [name]:
              reviewData.paymentMethods?.map((item: any) => item._id) || [],
          });
          break;
        case "withdrawalMethods":
          setReview({
            ...review,
            [name]:
              reviewData.paymentMethods?.map((item: any) => item._id) || [],
          });
          break;
        case "softwareProviders":
          setReview({
            ...review,
            [name]:
              reviewData.softwareProviders?.map((item: any) => item._id) || [],
          });
          break;
        case "gameTypes":
          setReview({
            ...review,
            [name]: reviewData.gameTypes?.map((item: any) => item._id) || [],
          });
          break;
        case "tags":
          setReview({
            ...review,
            [name]: reviewData.casinoTags?.map((tag: any) => tag._id) || [],
          });
          break;
        default:
          setReview({
            ...review,
            [name]: newValues.filter((val) => val !== "select-all"),
          });
          break;
      }
    } else {
      setReview({ ...review, [name]: newValues });
    }
  };

  const handleFaqChange = (
    index: number,
    field: keyof FaqItem,
    value: string
  ) => {
    const newFaq = [...review.faq];
    newFaq[index] = { ...newFaq[index], [field]: value };
    setReview({ ...review, faq: newFaq });
  };

  const addFaq = () => {
    setReview({
      ...review,
      faq: [...review.faq, { question: "", answer: "" }],
    });
  };

  const removeFaq = (index: number) => {
    const newFaq = [...review.faq];
    const removedFaq = newFaq.splice(index, 1)[0];
    setReview({ ...review, faq: newFaq });
    if (removedFaq._id) {
      setRemovedFaqIds([...removedFaqIds, removedFaq._id]);
      toast.info("FAQ removed. Save to apply changes.");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      if (name === "featuredLogo") {
        const file = files[0];
        setFeaturedLogo(file);
        setFeaturedLogoPreview(URL.createObjectURL(file));
        toast.info(`Selected logo: ${file.name}`);
      } else if (name === "screenshots") {
        setScreenshots(files);
        const newPreviews = Array.from(files).map((file) =>
          URL.createObjectURL(file)
        );
        setScreenshotPreviews(newPreviews);
        toast.info(`${files.length} screenshots selected.`);
      }
    }
  };

  const handleCancel = () => router.push("/content/casino-reviews");

  const handleSave = async () => {
    if (!review.name || !review.casinoUrl) {
      toast.error("Casino Name and Casino URL are required fields.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("id", review._id);

    if (featuredLogo) {
      submissionData.append("featuredLogo", featuredLogo);
    }
    if (screenshots) {
      Array.from(screenshots).forEach((file) => {
        submissionData.append("screenshots", file);
      });
    }

    submissionData.append("faq", JSON.stringify(review.faq));

    if (removedFaqIds.length > 0) {
      removedFaqIds.forEach((id) => {
        submissionData.append("removedFaqIds[]", id);
      });
    }

    const keys = Object.keys(review) as (keyof CasinoReviewData)[];
    for (const key of keys) {
      if (
        key === "_id" ||
        key === "featuredLogo" ||
        key === "screenshots" ||
        key === "faq"
      ) {
        continue;
      }

      const currentValue = review[key];
      const initialValue = initialReview[key];

      if (key === "reviewer" && currentValue === null) {
        continue;
      } else if (
        JSON.stringify(currentValue) !== JSON.stringify(initialValue)
      ) {
        if (key === "customerSupport" || key === "responsibleGambling") {
          submissionData.append(key, JSON.stringify(currentValue));
        } else if (Array.isArray(currentValue)) {
          currentValue.forEach((item: any) => {
            submissionData.append(`${key}[]`, String(item));
          });
        } else if (currentValue !== undefined && key !== 'withdrawalTimes' && key !== 'withdrawalLimits') {
          submissionData.append(key, String(currentValue));
        } else if (key === 'withdrawalTimes' || key === 'withdrawalLimits') {
          String(currentValue).split('\n').filter(item => item.trim() !== '').forEach(item => {
            submissionData.append(`${key}[]`, item);
          });
        }
      }
    }

    try {
      await dispatch(
        updateCasino({ id: review._id, casinoData: submissionData })
      ).unwrap();
      router.push("/content/casino-reviews");
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to update casino. Please try again.";
      toast.error(errorMessage);
    }
  };


  return (
    <BlankCard>
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: "4px",
          bgcolor: primaryLight,
        }}
      >
        <Typography variant="h6" fontWeight={600} fontSize={18}>
          Edit {review.name}
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        {/* General Section */}
        <Paper
          variant="outlined"
          sx={{ mb: 3, border: `1px solid ${borderColor}` }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ bgcolor: primaryLight, p: 2, borderRadius: "4px" }}
          >
            General
          </Typography>
          <Grid container spacing={3} sx={{ p: 3 }}>
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
              <CustomFormLabel htmlFor="casinoUrl">Casino URL</CustomFormLabel>
              <CustomTextField
                id="casinoUrl"
                name="casinoUrl"
                value={review.casinoUrl}
                onChange={handleInputChange}
                placeholder="https://www.example.com"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="rating">Rating</CustomFormLabel>
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
              <CustomFormLabel htmlFor="pros">
                Pros (one per line)
              </CustomFormLabel>
              <CustomTextField
                id="pros"
                name="pros"
                value={prosText}
                onChange={handleInputChange}
                placeholder="Great bonuses\nFast withdrawals\nWide game selection"
                multiline
                rows={4}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="cons">
                Cons (one per line)
              </CustomFormLabel>
              <CustomTextField
                id="cons"
                name="cons"
                value={consText}
                onChange={handleInputChange}
                placeholder="High wagering requirements\nLimited support hours"
                multiline
                rows={4}
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
                  onChange={(e) => handleMultiSelectChange(e, "languages")}
                  input={<OutlinedInput label="Select Languages" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected as string[]).map((id) => {
                        const language = reviewData?.languages?.find(
                          (l: any) => l._id === id
                        );
                        return (
                            <>
                              {language && (
                                <Chip
                                  key={id}
                                  label={!language ? "Unknown Language" : language?.name}
                                />
                              )}
                            </>
                      
                        );
                      })}
                    </Box>
                  )}
                >
                  <MenuItem value="select-all">Select All</MenuItem>
                  {(reviewData?.languages || []).map((language: any) => (
                    <MenuItem key={language._id} value={language._id}>
                      {language.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="dateEstablished">
                Date Established
              </CustomFormLabel>
              <CustomTextField
                id="dateEstablished"
                name="dateEstablished"
                value={review.dateEstablished}
                onChange={handleInputChange}
                placeholder="2023"
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
                  onChange={(e) => handleMultiSelectChange(e, "licences")}
                  input={<OutlinedInput label="Select Licences" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected as string[]).map((id) => {
                        const licence = reviewData?.licences?.find(
                          (l: any) => l._id === id
                        );
                        return (
                          <>
                          {licence && (<Chip
                            key={id}
                            label={!licence ? "Unknown Licence" : licence?.name}
                            />)}
                            </>
                        );
                      })}
                    </Box>
                  )}
                >
                  <MenuItem value="select-all">Select All</MenuItem>
                  {(reviewData?.licences || []).map((licence: any) => (
                    <MenuItem key={licence._id} value={licence._id}>
                      {licence.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="casinoType">
                Casino Type
              </CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="casinoType-label">
                  Select Casino Types
                </InputLabel>
                <Select
                  labelId="casinoType-label"
                  id="casinoType"
                  multiple
                  name="casinoType"
                  value={review.casinoType}
                  onChange={(e) => handleMultiSelectChange(e, "casinoType")}
                  input={<OutlinedInput label="Select Casino Types" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected as string[]).map((type) => (
                        
                        <>
                          {casinoTypes.find((t) => t === type) && (
                            <Chip key={type} label={type} />
                          )}
                
                        </>
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
              <CustomFormLabel htmlFor="affiliateProgram">
                Affiliate Program
              </CustomFormLabel>
              <CustomTextField
                id="affiliateProgram"
                name="affiliateProgram"
                value={review.affiliateProgram}
                onChange={handleInputChange}
                placeholder="Affiliate Program Name"
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
                placeholder="Company Name"
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
                  value={review.reviewer.length > 0 ? review.reviewer[0]._id : ''}
                  onChange={(e: SelectChangeEvent<string>) => {
                    const reviewerId = e.target.value;
                    const reviewer = reviewData?.reviewers.find(r => r._id === reviewerId);
                    setReview({ ...review, reviewer: reviewer ? [reviewer] : [] });
                  }}
                  input={<OutlinedInput label="Select Reviewer" />}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {reviewData?.reviewers.map(reviewer => (
                    <MenuItem key={reviewer._id} value={reviewer._id}>
                      {reviewer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="restrictedCountries">
                Restricted Countries
              </CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="restrictedCountries-label">
                  Select Restricted Countries
                </InputLabel>
                <Select
                  labelId="restrictedCountries-label"
                  id="restrictedCountries"
                  multiple
                  name="restrictedCountries"
                  value={review.restrictedCountries}
                  onChange={(e) =>
                    handleMultiSelectChange(e, "restrictedCountries")
                  }
                  input={<OutlinedInput label="Select Restricted Countries" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected as string[]).map((id) => {
                        const country = reviewData?.countries?.find(
                          (c: any) => c._id === id
                        );
                        return (
                          <>
                          {country && (
                            <Chip
                              key={id}
                              label={!country ? "Unknown Country" : country?.name}
                            />
                          )}
                          </>
                        );
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

        

        {/* Payment Methods Section */}
        <Paper
          variant="outlined"
          sx={{ mb: 3, border: `1px solid ${borderColor}` }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ bgcolor: primaryLight, p: 2, borderRadius: "4px" }}
          >
            Payment Methods
          </Typography>
          <Grid container spacing={3} sx={{ p: 3 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="depositMethods">
                Deposit Methods
              </CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="depositMethods-label">
                  Select Deposit Methods
                </InputLabel>
                <Select
                  labelId="depositMethods-label"
                  id="depositMethods"
                  multiple
                  name="depositMethods"
                  value={review.depositMethods}
                  onChange={(e) => handleMultiSelectChange(e, "depositMethods")}
                  input={<OutlinedInput label="Select Deposit Methods" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected as string[]).map((id) => {
                        const method = reviewData?.paymentMethods?.find(
                          (m: any) => m._id === id
                        );
                        return (
                          <>
                            {method && (
                              <Chip
                                key={id}
                                label={!method ? "Unknown Method" : method?.methods}
                              />
                            )}
                          </>
                        );
                      })}
                    </Box>
                  )}
                >
                  <MenuItem value="select-all">Select All</MenuItem>
                  {(reviewData?.paymentMethods || []).map((method: any) => (
                    <MenuItem key={method._id} value={method._id}>
                      {method.methods}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="withdrawalMethods">
                Withdrawal Methods
              </CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="withdrawalMethods-label">
                  Select Withdrawal Methods
                </InputLabel>
                <Select
                  labelId="withdrawalMethods-label"
                  id="withdrawalMethods"
                  multiple
                  name="withdrawalMethods"
                  value={review.withdrawalMethods}
                  onChange={(e) =>
                    handleMultiSelectChange(e, "withdrawalMethods")
                  }
                  input={<OutlinedInput label="Select Withdrawal Methods" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected as string[]).map((id) => {
                        const method = reviewData?.paymentMethods?.find(
                          (m: any) => m._id === id
                        );
                        return (
                           <>
                            {method && (
                              <Chip
                                key={id}
                                label={!method ? "Unknown Method" : method?.methods}
                              />
                            )}
                          </>
                        );
                      })}
                    </Box>
                  )}
                >
                  <MenuItem value="select-all">Select All</MenuItem>
                  {(reviewData?.paymentMethods || []).map((method: any) => (
                    <MenuItem key={method._id} value={method._id}>
                      {method.methods}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="withdrawalTimes">
                Withdrawal Times (one per line)
              </CustomFormLabel>
              <CustomTextField
                id="withdrawalTimes"
                name="withdrawalTimes"
                value={review.withdrawalTimes}
                onChange={handleInputChange}
                placeholder="1-3 business days
Instant for e-wallets"
                multiline
                rows={4}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="withdrawalLimits">
                Withdrawal Limits (one per line)
              </CustomFormLabel>
              <CustomTextField
                id="withdrawalLimits"
                name="withdrawalLimits"
                value={review.withdrawalLimits}
                onChange={handleInputChange}
                placeholder="$5000 per week
$20000 per month"
                multiline
                rows={4}
                fullWidth
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Games Section */}
        <Paper
          variant="outlined"
          sx={{ mb: 3, border: `1px solid ${borderColor}` }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ bgcolor: primaryLight, p: 2, borderRadius: "4px" }}
          >
            Games
          </Typography>
          <Grid container spacing={3} sx={{ p: 3 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="softwareProviders">
                Software Providers
              </CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="softwareProviders-label">
                  Select Providers
                </InputLabel>
                <Select
                  labelId="softwareProviders-label"
                  id="softwareProviders"
                  multiple
                  name="softwareProviders"
                  value={review.softwareProviders}
                  onChange={(e) =>
                    handleMultiSelectChange(e, "softwareProviders")
                  }
                  input={<OutlinedInput label="Select Providers" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected as string[]).map((id) => {
                        const provider = reviewData?.softwareProviders?.find(
                          (p: any) => p._id === id
                        );
                        return (
                          <>
                          {provider && (
                            <Chip
                              key={id}
                              label={provider?.name || "Unknown Provider"}
                            />
                          )}
                          </>
                        );
                      })}
                    </Box>
                  )}
                >
                  <MenuItem value="select-all">Select All</MenuItem>
                  {(reviewData?.softwareProviders || []).map(
                    (provider: any) => (
                      <MenuItem key={provider._id} value={provider._id}>
                        {provider.name}
                      </MenuItem>
                    )
                  )}
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
                  onChange={(e) => handleMultiSelectChange(e, "gameTypes")}
                  input={<OutlinedInput label="Select Game Types" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected as string[]).map((id) => {
                        const type = reviewData?.gameTypes?.find(
                          (t: any) => t._id === id
                        );
                        return (
                          <>
                          {type && (
                            <Chip
                              key={id}
                              label={type?.name || "Unknown Game Type"}
                            />
                          )}
                          </>
                        );
                      })}
                    </Box>
                  )}
                >
                  <MenuItem value="select-all">Select All</MenuItem>
                  {(reviewData?.gameTypes || []).map((type: any) => (
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
        <Paper
          variant="outlined"
          sx={{ mb: 3, border: `1px solid ${borderColor}` }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ bgcolor: primaryLight, p: 2, borderRadius: "4px" }}
          >
            Content
          </Typography>
          <Grid container spacing={3} sx={{ p: 3 }}>
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
              <CustomFormLabel htmlFor="metaDescription">
                Meta Description
              </CustomFormLabel>
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
              <ImageUpload
                id="featuredLogo"
                label="Featured Logo"
                onChange={handleFileChange}
              />
              {featuredLogoPreview ? (
                <img
                  src={featuredLogoPreview}
                  alt="New Featured Logo Preview"
                  width="100"
                  style={{ marginTop: "10px", borderRadius: "10px" }}
                />
              ) : review.featuredLogo ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${review.featuredLogo}`}
                  alt="Current Featured Logo"
                  width="100"
                  style={{ marginTop: "10px", borderRadius: "10px" }}
                />
              ) : null}
            </Grid>
            <Grid item xs={12} sm={6}>
              <MultiImageUpload
                id="screenshots"
                label="Screenshots Gallery"
                onChange={handleFileChange}
              />
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 1, overflowX: "auto", flexWrap: "nowrap" }}
              >
                {screenshotPreviews.length > 0
                  ? screenshotPreviews.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`New Screenshot Preview ${index + 1}`}
                        width="100"
                        style={{ marginTop: "10px", borderRadius: "10px" }}
                      />
                    ))
                  : review.screenshots?.map((img, index) => (
                      <img
                        key={index}
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${img}`}
                        alt={`Current Screenshot ${index + 1}`}
                        width="100"
                        style={{ marginTop: "10px", borderRadius: "10px" }}
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
                  "& .ql-toolbar": {
                    borderBottom: `1px solid ${borderColor}`,
                    bgcolor: "primary.light",
                    borderRadius: "4px 4px 0 0",
                  },
                  "& .ql-container": {
                    minHeight: 250,
                    borderRadius: "0 0 4px 4px",
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
                    borderRadius: "4px",
                    "& .ql-editor": {
                      padding: 0,
                    },
                  }}
                >
                  <div
                    className="ql-editor"
                    dangerouslySetInnerHTML={{ __html: review.body || "" }}
                  />
                </Paper>
              </Box>
            </Grid>
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
                  onChange={(e) => handleMultiSelectChange(e, "tags")}
                  input={<OutlinedInput label="Select Tags" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected as string[]).map((id) => {
                        const tag = reviewData?.casinoTags?.find(
                          (t: any) => t._id === id
                        );
                        return (
                          <>
                          {tag && (<Chip
                            key={id}
                            label={!tag ? "Unknown Tag" : tag?.name}
                            />)}
                          </>
                        );
                      })}
                    </Box>
                  )}
                >
                  <MenuItem value="select-all">Select All</MenuItem>
                  {(reviewData?.casinoTags || []).map((tag: any) => (
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
                      id="isFeatured"
                      name="isFeatured"
                      checked={review.isFeatured}
                      onChange={handleInputChange}
                    />
                  }
                  label={review.isFeatured ? 'Yes' : 'No'}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <CustomFormLabel>FAQ</CustomFormLabel>
              <Box>
                {review.faq.map((faqItem, index) => (
                  <Box
                    key={faqItem._id || index}
                    sx={{
                      mb: 2,
                      border: `1px solid ${borderColor}`,
                      p: 2,
                      borderRadius: "4px",
                    }}
                  >
                    <CustomTextField
                      fullWidth
                      label="Question"
                      variant="outlined"
                      value={faqItem.question}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleFaqChange(index, "question", e.target.value)
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
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleFaqChange(index, "answer", e.target.value)
                      }
                      placeholder={`Answer #${index + 1}`}
                    />
                    <IconButton
                      onClick={() => removeFaq(index)}
                      color="error"
                      sx={{ mt: 1 }}
                    >
                      <IconMinus />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<IconPlus />}
                  onClick={addFaq}
                  variant="outlined"
                >
                  Add FAQ
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Customer Support Section */}
        <Paper
          variant="outlined"
          sx={{ mb: 3, border: `1px solid ${borderColor}` }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ bgcolor: primaryLight, p: 2, borderRadius: "4px" }}
          >
            Customer Support
          </Typography>
          <Grid container spacing={3} sx={{ p: 3 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel>Live Chat Available</CustomFormLabel>
              <Box>
                <FormControlLabel
                  control={
                    <CustomSwitch
                      id="liveChat"
                      name="liveChat"
                      checked={review.customerSupport.liveChat}
                      onChange={handleInputChange}
                    />
                  }
                  label={review.customerSupport.liveChat ? "Yes" : "No"}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel htmlFor="phone">Phone</CustomFormLabel>
              <CustomTextField
                id="phone"
                name="phone"
                value={review.customerSupport.phone}
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
                value={review.customerSupport.email}
                onChange={handleInputChange}
                placeholder="support@example.com"
                fullWidth
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Responsible Gambling Section */}
        <Paper
          variant="outlined"
          sx={{ mb: 3, border: `1px solid ${borderColor}` }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ bgcolor: primaryLight, p: 2, borderRadius: "4px" }}
          >
            Responsible Gambling
          </Typography>
          <Grid container spacing={3} sx={{ p: 3 }}>
            <Grid item xs={12} sm={4}>
              <CustomFormLabel>Deposit Limit</CustomFormLabel>
              <Box>
                <FormControlLabel
                  control={
                    <CustomSwitch
                      id="depositLimit"
                      name="depositLimit"
                      checked={review.responsibleGambling.depositLimit}
                      onChange={handleInputChange}
                    />
                  }
                  label={review.responsibleGambling.depositLimit ? "Yes" : "No"}
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
                      checked={review.responsibleGambling.selfExclusion}
                      onChange={handleInputChange}
                    />
                  }
                  label={
                    review.responsibleGambling.selfExclusion ? "Yes" : "No"
                  }
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
                      checked={review.responsibleGambling.withdrawal}
                      onChange={handleInputChange}
                    />
                  }
                  label={review.responsibleGambling.withdrawal ? "Yes" : "No"}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Update
          </Button>
          <Button variant="text" color="error" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </BlankCard>
  );
};

export default EditCasinoReview;
