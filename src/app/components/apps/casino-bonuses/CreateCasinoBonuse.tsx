'use client';
import React, { useState, ChangeEvent, useEffect } from "react";
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
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { IconPlus, IconMinus } from "@tabler/icons-react";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import { AppDispatch, RootState } from "@/store/store";
import { createBonus, fetchCasinoBonusCreateData, Bonus } from "@/store/apps/bonuses/bonuseSlice";
import { toast } from "react-toastify";
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

const CreateCasinoBonus = () => {
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;
  const borderColor = theme.palette.divider;
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const { isLoading } = useSelector((state: RootState) => state.bonus);
  const { bonuseTypes, bonusTags, casinos, games } = useSelector((state: RootState) => state.bonus.bonusCreateData);

  useEffect(() => {
    dispatch(fetchCasinoBonusCreateData());
  }, [dispatch]);

  const [bonus, setBonus] = useState<Omit<Bonus, '_id' | 'slug' | 'user' | 'createdAt' | 'updatedAt' | 'bonusType' | 'casino' | 'tags' | 'allowedGames'> & {
    bonusType: string;
    casino: string;
    tags: string[];
    allowedGames: string[];
    faq: { question: string; answer: string }[];
  }>({
    name: "",
    bonusType: "",
    casino: "",
    minimumDeposit: "",
    bonusCode: "",
    wageringRequirements: "",
    maximumBonusAmount: "",
    maximumCashout: "",
    bonusValue: "",
    tags: [],
    url: "",
    allowedGames: [],
    additionalInformation: "",
    seoTitle: "",
    metaDescription: "",
    excerpt: "",
    body: "",
    featured: false,
    faq: [],
    status: "enabled",
    featuredImage: "",
  });

  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (featuredImagePreview) {
        URL.revokeObjectURL(featuredImagePreview);
      }
    };
  }, [featuredImagePreview]);

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
    name: "bonusType" | "casino"
  ) => {
    const { value } = event.target;
    setBonus({ ...bonus, [name]: value });
  };


  const handleMultiSelectChange = (
    event: SelectChangeEvent<string[]>,
    name: "tags" | "allowedGames"
  ) => {
    const { value } = event.target;
    let newValues: string[] = Array.isArray(value) ? value : value.split(',');

    if (newValues.includes("select-all")) {
      const allIds = (name === "tags" ? bonusTags : games).map(item => item._id);
      setBonus({ ...bonus, [name]: allIds });
    } else {
      setBonus({ ...bonus, [name]: newValues });
    }
  };

  const handleFaqChange = (
    index: number,
    field: "question" | "answer",
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
    const newFaq = [...bonus.faq];
    newFaq.splice(index, 1);
    setBonus({ ...bonus, faq: newFaq });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 2 * 1024 * 1024;
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, or JPEG images are allowed.");
        return;
      }
      if (file.size > maxSize) {
        toast.error("Image size must be less than 2MB.");
        return;
      }
      setFeaturedImage(file);
      setFeaturedImagePreview(URL.createObjectURL(file));
      toast.info(`Selected image: ${file.name}`);
    }
  };

  const handleSave = async () => {
    if (!bonus.name || !bonus.casino || !bonus.bonusType || !bonus.url || !featuredImage) {
      toast.error("Please fill all required fields: Bonus Name, Casino, Bonus Type, URL, and Featured Image.");
      return;
    }

    if (bonus.faq.some(item => !item.question.trim() || !item.answer.trim())) {
      toast.error("All FAQ questions and answers must be filled.");
      return;
    }


    const submissionData = new FormData();
    Object.entries(bonus).forEach(([key, value]) => {
      if (key === "faq") {
        submissionData.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        value.forEach(item => submissionData.append(key, typeof item === "string" ? item : JSON.stringify(item)));
      } else {
        submissionData.append(key, String(value));
      }
    });

    if (featuredImage) {
      submissionData.append("featuredImage", featuredImage);
    }

    const result = await dispatch(createBonus(submissionData));
    if (createBonus.fulfilled.match(result)) {
      router.push("/content/bonuses");
    } else {
      toast.error("Failed to create bonus.");
    }
  };

  const handleCancel = () => {
    router.push("/content/bonuses");
  };

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
        <Typography variant="h6" fontWeight={600} fontSize={18}>
          Create Bonus
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Paper
          variant="outlined"
          sx={{ mb: 3, border: `1px solid ${borderColor}` }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ bgcolor: primaryLight, p: 2, borderRadius: '4px' }}>
            Bonus Details
          </Typography>
          <Grid container spacing={3} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="name">Bonus Name</CustomFormLabel>
              <CustomTextField
                id="name"
                name="name"
                value={bonus.name}
                onChange={handleInputChange}
                placeholder="Bonus Name"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="casino">Casino</CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="casino-label">Select Casino</InputLabel>
                <Select
                  labelId="casino-label"
                  id="casino"
                  name="casino"
                  value={bonus.casino}
                  onChange={(e) => handleSelectChange(e, "casino")}
                  input={<OutlinedInput label="Select Casino" />}
                >
                  {casinos.map((casino) => (
                    <MenuItem key={casino._id} value={casino._id}>
                      {casino.name}
                    </MenuItem>
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
                  id="bonusType"
                  name="bonusType"
                  value={bonus.bonusType}
                  onChange={(e) => handleSelectChange(e, "bonusType")}
                  input={<OutlinedInput label="Select Bonus Type" />}
                >
                  {bonuseTypes.map((type) => (
                    <MenuItem key={type._id} value={type._id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="minimumDeposit">Minimum Deposit</CustomFormLabel>
              <CustomTextField
                id="minimumDeposit"
                name="minimumDeposit"
                value={bonus.minimumDeposit}
                onChange={handleInputChange}
                placeholder="$20"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="bonusCode">Bonus Code</CustomFormLabel>
              <CustomTextField
                id="bonusCode"
                name="bonusCode"
                value={bonus.bonusCode}
                onChange={handleInputChange}
                placeholder="WELCOME100"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="wageringRequirements">Wagering Requirements</CustomFormLabel>
              <CustomTextField
                id="wageringRequirements"
                name="wageringRequirements"
                value={bonus.wageringRequirements}
                onChange={handleInputChange}
                placeholder="35"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="maximumBonusAmount">Maximum Bonus Amount</CustomFormLabel>
              <CustomTextField
                id="maximumBonusAmount"
                name="maximumBonusAmount"
                value={bonus.maximumBonusAmount}
                onChange={handleInputChange}
                placeholder="$1000"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="maximumCashout">Maximum Cashout</CustomFormLabel>
              <CustomTextField
                id="maximumCashout"
                name="maximumCashout"
                value={bonus.maximumCashout}
                onChange={handleInputChange}
                placeholder="$5000"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="bonusValue">Bonus Value</CustomFormLabel>
              <CustomTextField
                id="bonusValue"
                name="bonusValue"
                value={bonus.bonusValue}
                onChange={handleInputChange}
                placeholder="$500"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="allowedGames">Allowed Games</CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="allowedGames-label">Select Allowed Games</InputLabel>
                <Select
                  labelId="allowedGames-label"
                  id="allowedGames"
                  multiple
                  name="allowedGames"
                  value={bonus.allowedGames}
                  onChange={(e) => handleMultiSelectChange(e, "allowedGames")}
                  input={<OutlinedInput label="Select Allowed Games" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        const game = games.find(g => g._id === value);
                        return <Chip key={value} label={game ? game.name : value} />;
                      })}
                    </Box>
                  )}
                >
                  <MenuItem value="select-all">Select All</MenuItem>
                  {games.map((game) => (
                    <MenuItem key={game._id} value={game._id}>
                      {game.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Paper
          variant="outlined"
          sx={{ mb: 3, border: `1px solid ${borderColor}` }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ bgcolor: primaryLight, p: 2, borderRadius: '4px' }}>
            Marketing
          </Typography>
          <Grid container spacing={3} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="seoTitle">SEO Title</CustomFormLabel>
              <CustomTextField
                id="seoTitle"
                name="seoTitle"
                value={bonus.seoTitle}
                onChange={handleInputChange}
                placeholder="Grand Fortune Welcome Bonus - Up to $1000"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="metaDescription">Meta Description</CustomFormLabel>
              <CustomTextField
                id="metaDescription"
                name="metaDescription"
                value={bonus.metaDescription}
                onChange={handleInputChange}
                placeholder="Claim a 100% match bonus up to $1000..."
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="url">URL</CustomFormLabel>
              <CustomTextField
                id="url"
                name="url"
                value={bonus.url}
                onChange={handleInputChange}
                placeholder="https://example.com/bonus"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ImageUpload id="featuredImage" label="Featured Image" onChange={handleFileChange} />
              {featuredImagePreview && (
                <img src={featuredImagePreview} alt="Featured Image Preview" width="100" style={{ marginTop: '10px', borderRadius: '10px' }} />
              )}
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="excerpt">Excerpt</CustomFormLabel>
              <CustomTextField
                id="excerpt"
                name="excerpt"
                multiline
                rows={4}
                value={bonus.excerpt}
                onChange={handleInputChange}
                placeholder="A short summary of the bonus."
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="additionalInformation">Additional Information</CustomFormLabel>
              <CustomTextField
                id="additionalInformation"
                name="additionalInformation"
                value={bonus.additionalInformation}
                onChange={handleInputChange}
                placeholder="Additional details about the bonus..."
                fullWidth
                multiline
                rows={6}
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
                  value={bonus.body}
                  onChange={(value) => setBonus({ ...bonus, body: value })}
                  placeholder="The main content of the bonus description..."
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
                  id="tags"
                  multiple
                  name="tags"
                  value={bonus.tags}
                  onChange={(e) => handleMultiSelectChange(e, "tags")}
                  input={<OutlinedInput label="Select Tags" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        const tag = bonusTags.find(t => t._id === value);
                        return <Chip key={value} label={tag ? tag.name : value} />;
                      })}
                    </Box>
                  )}
                >
                  <MenuItem value="select-all">Select All</MenuItem>
                  {bonusTags.map((tag) => (
                    <MenuItem key={tag._id} value={tag._id}>
                      {tag.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel>Featured?</CustomFormLabel>
              <FormControlLabel
                control={
                  <CustomSwitch
                    id="featured"
                    name="featured"
                    checked={bonus.featured}
                    onChange={handleInputChange}
                  />
                }
                label={bonus.featured ? "Yes" : "No"}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <CustomFormLabel>FAQ</CustomFormLabel>
              <Box>
                {bonus.faq.map((faqItem, index) => (
                  <Box
                    key={index}
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
                      value={faqItem.question}
                      onChange={(e: { target: { value: string; }; }) => handleFaqChange(index, "question", e.target.value)}
                      sx={{ mb: 1 }}
                      placeholder={`Question #${index + 1}`}
                    />
                    <CustomTextField
                      fullWidth
                      label="Answer"
                      multiline
                      rows={2}
                      value={faqItem.answer}
                      onChange={(e: { target: { value: string; }; }) => handleFaqChange(index, "answer", e.target.value)}
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

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
          <Button variant="text" color="error" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </BlankCard>
  );
};

export default CreateCasinoBonus;