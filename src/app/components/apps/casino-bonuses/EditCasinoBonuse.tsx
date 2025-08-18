'use client';
import React, { useState, useEffect, ChangeEvent, ComponentProps } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import { toast } from "react-toastify";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import { AppDispatch, RootState } from "@/store/store";
import { updateBonus, Bonus, fetchCasinoBonusCreateData } from "@/store/apps/bonuses/bonuseSlice";
import BlankCard from "../../shared/BlankCard";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

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

interface EditCasinoBonusProps {
  bonus: Bonus | null;
  isLoading: boolean;
  error: string | null;
}

const EditCasinoBonus = ({ bonus: initialBonus, isLoading, error }: EditCasinoBonusProps) => {
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;
  const borderColor = theme.palette.divider;
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { isLoading: sliceIsLoading } = useSelector((state: RootState) => state.bonus);
  const { bonuseTypes, bonusTags, casinos, games } = useSelector((state: RootState) => state.bonus.bonusCreateData);

  const defaultBonus: Bonus = {
    _id: "",
    name: "",
    slug: "",
    casino: { _id: "", name: "" },
    bonusType: { _id: "", name: "" },
            minimumDeposit: "",
    bonusCode: "",
    wageringRequirements: "",
    maximumBonusAmount: "",
    maximumCashout: "",
    bonusValue: "",
    allowedGames: [],
    seoTitle: "",
    metaDescription: "",
    url: "",
    featuredImage: "",
    status: "enabled",
    excerpt: "",
    additionalInformation: "",
    body: "",
    tags: [],
    featured: false,
    faq: [],
    createdAt: "",
    updatedAt: "",
    user: "",
  };

  const [bonus, setBonus] = useState<Bonus>(initialBonus || defaultBonus);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCasinoBonusCreateData());
  }, [dispatch]);

  useEffect(() => {
    if (initialBonus) {
        setBonus(initialBonus);
    }
  }, [initialBonus]);


  useEffect(() => {
    return () => {
      if (featuredImagePreview) {
        URL.revokeObjectURL(featuredImagePreview);
      }
    };
  }, [featuredImagePreview]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading bonus data...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!initialBonus) {
    return <Typography>Bonus not found.</Typography>;
  }


  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;
  
    const isNumericField = ["minimumDeposit", "maximumBonusAmount", "maximumCashout", "bonusValue", "wageringRequirements"].includes(name);
  
    if (isNumericField) {
      const numValue = parseFloat(value);
      if (value === "" || (!isNaN(numValue) && numValue >= 0)) {
        setBonus({ ...bonus, [name]: value });
      } else {
        toast.error(`Invalid input for ${name}. Please enter a positive number.`);
      }
    } else {
      setBonus({
        ...bonus,
        [name]: type === "checkbox" || type === "switch" ? checked : value,
      });
    }
  };

  const handleSelectChange = (
    event: SelectChangeEvent<string>,
    name: keyof Pick<Bonus, 'bonusType' | 'casino'>
  ) => {
    const { value } = event.target;
    const selectedObject = (name === 'bonusType' ? bonuseTypes : casinos).find(item => item._id === value);
    if(selectedObject){
        setBonus({ ...bonus, [name]: selectedObject });
    }
  };

  const handleMultiSelectChange = (
    event: SelectChangeEvent<string[]>,
    name: keyof Pick<Bonus, 'tags' | 'allowedGames'>
  ) => {
    const { value } = event.target;
    const selectedIds = Array.isArray(value) ? value : [value];
    
    const sourceArray = name === 'tags' ? bonusTags : games;
    const selectedObjects = sourceArray.filter(item => selectedIds.includes(item._id));

    setBonus({ ...bonus, [name]: selectedObjects });
  };

  const handleFaqChange = (
    index: number,
    field: 'question' | 'answer',
    value: string
  ) => {
    const newFaq = [...bonus.faq];
    newFaq[index] = { ...newFaq[index], [field]: value };
    setBonus({ ...bonus, faq: newFaq });
  };

  const addFaq = () => {
    setBonus({
      ...bonus,
      faq: [...bonus.faq, { question: "", answer: "" }],
    });
  };

  const removeFaq = (index: number) => {
    const newFaq = bonus.faq.filter((_, i) => i !== index);
    setBonus({ ...bonus, faq: newFaq });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFeaturedImage(file);
      setFeaturedImagePreview(URL.createObjectURL(file));
      toast.info(`Selected image: ${file.name}`);
    }
  };

  const handleSave = async () => {
    const submissionData = new FormData();
    
    // Append fields that have changed
    (Object.keys(bonus) as Array<keyof Bonus>).forEach(key => {
        const currentValue = bonus[key];
        const initialValue = initialBonus[key];

        if (JSON.stringify(currentValue) !== JSON.stringify(initialValue)) {
            if (key === 'bonusType' || key === 'casino') {
                submissionData.append(key, (currentValue as any)._id);
            } else if (key === 'tags' || key === 'allowedGames') {
                (currentValue as any[]).forEach(item => submissionData.append(key, item._id));
            } else if (key === 'faq') {
                submissionData.append(key, JSON.stringify(currentValue));
            }
            else if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'user' && key !== 'slug') {
                submissionData.append(key, currentValue as string);
            }
        }
    });

    if (featuredImage) {
        submissionData.append("featuredImage", featuredImage);
    }
  
    try {
      await dispatch(updateBonus({ id: bonus._id, bonusData: submissionData })).unwrap();
      router.push("/content/bonuses");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update bonus. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    router.push("/content/bonuses");
  };

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
        <Typography variant="h6" fontWeight={600} fontSize={18}>
          Edit {bonus.name}
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Paper variant="outlined" sx={{ mb: 3, border: `1px solid ${borderColor}` }}>
          <Typography variant="h6" fontWeight={600} sx={{ bgcolor: primaryLight, p: 2, borderRadius: '4px' }}>
            Bonus Details
          </Typography>
          <Grid container spacing={3} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="name">Bonus Name</CustomFormLabel>
              <CustomTextField id="name" name="name" value={bonus.name} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="casino">Casino</CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="casino-label">Select Casino</InputLabel>
                <Select
                  labelId="casino-label"
                  value={bonus.casino?._id || ''}
                  onChange={(e) => handleSelectChange(e, "casino")}
                  input={<OutlinedInput label="Select Casino" />}
                >
                  {casinos.map((c) => (
                    <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="bonusType">Bonus Type</CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="bonusType-label">Select Bonus Type</InputLabel>
                <Select
                  labelId="bonusType-label"
                  value={bonus.bonusType?._id || ''}
                  onChange={(e) => handleSelectChange(e, "bonusType")}
                  input={<OutlinedInput label="Select Bonus Type" />}
                >
                  {bonuseTypes.map((bt) => (
                    <MenuItem key={bt._id} value={bt._id}>{bt.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="minimumDeposit">Minimum Deposit</CustomFormLabel>
                <CustomTextField id="minimumDeposit" name="minimumDeposit" value={bonus.minimumDeposit} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="bonusCode">Bonus Code</CustomFormLabel>
                <CustomTextField id="bonusCode" name="bonusCode" value={bonus.bonusCode} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="wageringRequirements">Wagering Requirements</CustomFormLabel>
                <CustomTextField id="wageringRequirements" name="wageringRequirements" value={bonus.wageringRequirements} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="maximumBonusAmount">Maximum Bonus Amount</CustomFormLabel>
                <CustomTextField id="maximumBonusAmount" name="maximumBonusAmount" value={bonus.maximumBonusAmount} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="maximumCashout">Maximum Cashout</CustomFormLabel>
                <CustomTextField id="maximumCashout" name="maximumCashout" value={bonus.maximumCashout} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="bonusValue">Bonus Value</CustomFormLabel>
                <CustomTextField id="bonusValue" name="bonusValue" value={bonus.bonusValue} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="allowedGames">Allowed Games</CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="allowedGames-label">Select Allowed Games</InputLabel>
                <Select
                  labelId="allowedGames-label"
                  multiple
                  value={bonus.allowedGames?.map(g => g._id) || []}
                  onChange={(e) => handleMultiSelectChange(e, "allowedGames")}
                  input={<OutlinedInput label="Select Allowed Games" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {games.filter(g => selected.includes(g._id)).map(g => (
                        <Chip key={g._id} label={g.name} />
                      ))}
                    </Box>
                  )}
                >
                  {games.map((g) => (
                    <MenuItem key={g._id} value={g._id}>{g.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ mb: 3, border: `1px solid ${borderColor}` }}>
        <Typography variant="h6" fontWeight={600} sx={{ bgcolor: primaryLight, p: 2, borderRadius: '4px' }}>
            Marketing
          </Typography>
          <Grid container spacing={3} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="seoTitle">SEO Title</CustomFormLabel>
                <CustomTextField id="seoTitle" name="seoTitle" value={bonus.seoTitle} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="metaDescription">Meta Description</CustomFormLabel>
                <CustomTextField id="metaDescription" name="metaDescription" value={bonus.metaDescription} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomFormLabel htmlFor="url">URL</CustomFormLabel>
                <CustomTextField id="url" name="url" value={bonus.url} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <ImageUpload id="featuredImage" label="Featured Image" onChange={handleFileChange} />
                {featuredImagePreview ? (
                    <img src={featuredImagePreview} alt="New Preview" width="100" style={{ marginTop: '10px', borderRadius: '10px' }} />
                ) : bonus.featuredImage && (
                    <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${bonus.featuredImage}`} alt="Current Image" width="100" style={{ marginTop: '10px', borderRadius: '10px' }} />
                )}
            </Grid>
            <Grid item xs={12}>
                <CustomFormLabel htmlFor="excerpt">Excerpt</CustomFormLabel>
                <CustomTextField id="excerpt" name="excerpt" multiline rows={4} value={bonus.excerpt} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
                <CustomFormLabel htmlFor="additionalInformation">Additional Information</CustomFormLabel>
                <CustomTextField id="additionalInformation" name="additionalInformation" multiline rows={6} value={bonus.additionalInformation} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
                <CustomFormLabel htmlFor="body">Body</CustomFormLabel>
                <Paper variant="outlined" sx={{ border: `1px solid ${borderColor}` }}>
                <ReactQuill
                  value={bonus.body}
                  onChange={(value) => setBonus({ ...bonus, body: value })}
                  placeholder="The main content of the game description..."
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
                  dangerouslySetInnerHTML={{ __html: bonus.body }}
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
                  multiple
                  value={bonus.tags?.map(t => t._id) || []}
                  onChange={(e) => handleMultiSelectChange(e, "tags")}
                  input={<OutlinedInput label="Select Tags" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {bonusTags.filter(t => selected.includes(t._id)).map(t => (
                            <Chip key={t._id} label={t.name} />
                        ))}
                    </Box>
                  )}
                >
                  {bonusTags.map((t) => (
                    <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomFormLabel>Featured?</CustomFormLabel>
                <FormControlLabel
                    control={<CustomSwitch id="featured" name="featured" checked={bonus.featured} onChange={handleInputChange} />}
                    label={bonus.featured ? "Yes" : "No"}
                />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <CustomFormLabel>FAQ</CustomFormLabel>
              {bonus.faq?.map((faqItem, index) => (
                <Box key={index} sx={{ mb: 2, border: `1px solid ${borderColor}`, p: 2, borderRadius: "4px" }}>
                  <CustomTextField fullWidth label="Question" value={faqItem.question} onChange={(e: { target: { value: string; }; }) => handleFaqChange(index, "question", e.target.value)} sx={{ mb: 1 }} />
                  <CustomTextField fullWidth label="Answer" multiline rows={2} value={faqItem.answer} onChange={(e: { target: { value: string; }; }) => handleFaqChange(index, "answer", e.target.value)} />
                  <IconButton onClick={() => removeFaq(index)} color="error" sx={{ mt: 1 }}><IconMinus /></IconButton>
                </Box>
              ))}
              <Button startIcon={<IconPlus />} onClick={addFaq} variant="outlined">Add FAQ</Button>
            </Grid>
          </Grid>
        </Paper>

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={sliceIsLoading}>
            {sliceIsLoading ? "Updating..." : "Update"}
          </Button>
          <Button variant="text" color="error" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </BlankCard>
  );
};

export default EditCasinoBonus;

