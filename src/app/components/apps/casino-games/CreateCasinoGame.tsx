'use client';
import React, { useState, ComponentProps, ChangeEvent, useEffect } from "react";
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
import { IconPlus, IconMinus } from "@tabler/icons-react";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { createGame, fetchGameCreateData } from "@/store/apps/games/gameSlice";
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
}) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, or JPEG images are allowed.");
        return;
      }

      if (file.size > maxSize) {
        toast.error("Image size must be less than 2MB.");
        return;
      }

      onChange(e);
    }
  };

  return (
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
            onChange={handleFileChange}
          />
        </Button>
      </Box>
    </Box>
  );
};

const MultiImageUpload = ({
  label,
  id,
  onChange,
}: {
  label: string;
  id: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 2 * 1024 * 1024; // 2MB

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!allowedTypes.includes(file.type)) {
          toast.error("Only JPG, PNG, or JPEG images are allowed.");
          return;
        }

        if (file.size > maxSize) {
          toast.error("Image size must be less than 2MB.");
          return;
        }
      }

      onChange(e);
    }
  };

  return (
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
            onChange={handleFileChange}
          />
        </Button>
      </Box>
    </Box>
  );
};

interface FaqItem {
  question: string;
  answer: string;
}

interface CasinoGameData {
  name: string;
  slug: string;
  softwareProvider: string;
  gameType: string;
  paylines: number | string;
  reels: number | string;
  minCoinsPerLine: number | string;
  maxCoinsPerLine: number | string;
  minCoinsSize: number | string;
  maxCoinsSize: number | string;
  rtp: number | string;
  bonusGame: boolean;
  progressive: boolean;
  wildSymbol: boolean;
  scatterSymbol: boolean;
  autoplayOption: boolean;
  multiplier: boolean;
  freeSpins: boolean;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  body: string;
  tags: string[];
  featured: boolean;
  faq: FaqItem[];
}

const initialGameState: CasinoGameData = {
  name: "",
  slug: "",
  softwareProvider: "",
  gameType: "",
  paylines: "",
  reels: "",
  minCoinsPerLine: "",
  maxCoinsPerLine: "",
  minCoinsSize: "",
  maxCoinsSize: "",
  rtp: "",
  bonusGame: false,
  progressive: false,
  wildSymbol: false,
  scatterSymbol: false,
  autoplayOption: false,
  multiplier: false,
  freeSpins: false,
  seoTitle: "",
  metaDescription: "",
  excerpt: "",
  body: "",
  tags: [],
  featured: false,
  faq: [],
};

const CreateCasinoGame = () => {
  const theme = useTheme();
  const borderColor = theme.palette.divider;
  const primaryLight = theme.palette.primary.light;
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.games);

  const [game, setGame] = useState<CasinoGameData>(initialGameState);
  const [featuredLogo, setFeaturedLogo] = useState<File | null>(null);
  const [screenshots, setScreenshots] = useState<FileList | null>(null);
  const [featuredLogoPreview, setFeaturedLogoPreview] = useState<string | null>(
    null
  );
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
  const [softwareProviders, setSoftwareProviders] = useState<any[]>([]);
  const [gameTypes, setGameTypes] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchGameCreateData())
      .then((action) => {
        if (fetchGameCreateData.fulfilled.match(action)) {
          const { softwareProviders, gameTypes, gameTags } = action.payload;
          setSoftwareProviders(softwareProviders);
          setGameTypes(gameTypes);
          setTags(gameTags);
        }
      })
      .catch((error) => {
        toast.error(`Failed to fetch game data: ${error.message}`);
      });
  }, [dispatch]);

  useEffect(() => {
    // Cleanup object URLs on unmount
    return () => {
      if (featuredLogoPreview) {
        URL.revokeObjectURL(featuredLogoPreview);
      }
      screenshotPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [featuredLogoPreview, screenshotPreviews]);

  const handleSelectChange = (
    event: SelectChangeEvent<string>,
    name: keyof CasinoGameData
  ) => {
    const { value } = event.target;
    setGame({ ...game, [name]: value });
  };

  const handleMultiSelectChange = (
    event: SelectChangeEvent<string[]>,

    name: keyof CasinoGameData
  ) => {
    const {
      target: { value },
    } = event;
    let newValues: string[] = [];

    if (typeof value === "string") {
      newValues = value.split(",");
    } else {
      newValues = value;
    }

    if (newValues.includes("select-all")) {
      switch (name) {
        case "tags":
          setGame({ ...game, [name]: tags.map((tag) => tag._id) });
          break;
        default:
          setGame({ ...game, [name]: newValues.filter(val => val !== "select-all") });
          break;
      }
    } else {
      setGame({
        ...game,
        [name]: newValues,
      });
    }
  };

  const handleFaqChange = (
    index: number,
    field: keyof FaqItem,
    value: string
  ) => {
    const newFaq = [...game.faq];
    newFaq[index] = { ...newFaq[index], [field]: value };
    setGame({ ...game, faq: newFaq });
  };

  const addFaq = () => {
    setGame({
      ...game,
      faq: [...game.faq, { question: "", answer: "" }],
    });
  };

  const removeFaq = (index: number) => {
    const newFaq = [...game.faq];
    newFaq.splice(index, 1);
    setGame({ ...game, faq: newFaq });
  };

  const handleBodyChange = (value: string) => {
    setGame((prevGame) => ({ ...prevGame, body: value }));
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;

    if (name === "name" && !game.slug) {
      const newSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setGame({ ...game, [name]: value, slug: newSlug });
    } else if (["paylines", "reels", "minCoinsPerLine", "maxCoinsPerLine", "minCoinsSize", "maxCoinsSize", "rtp"].includes(name)) {
      const numValue = parseFloat(value);
      if (value === "" || (!isNaN(numValue) && numValue > 0)) {
        setGame({ ...game, [name]: value });
      } else {
        toast.error(`Invalid input for ${name}. Please enter a positive number.`);
      }
    } else {
      setGame({
        ...game,
        [name]: type === "checkbox" || type === "switch" ? checked : value,
      });
    }
  };

  const handleSave = async () => {
    if (!game.name ) {
      toast.error("Game Name is required.");
      return;
    }
    if (
      parseFloat(game.minCoinsPerLine as string) >=
      parseFloat(game.maxCoinsPerLine as string)
    ) {
      toast.error("Min coins per line must be less than max coins per line.");
      return;
    }

    if (
      parseFloat(game.minCoinsSize as string) >=
      parseFloat(game.maxCoinsSize as string)
    ) {
      toast.error("Min coin size must be less than max coin size.");
      return;
    }
    if (!featuredLogo) {
      toast.error("A Featured Logo is required.");
      return;
    }

    const submissionData = new FormData();

    Object.entries(game).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (key === 'faq') {
          value.forEach((item, index) => {
            submissionData.append(`faq[${index}][question]`, item.question);
            submissionData.append(`faq[${index}][answer]`, item.answer);
          });
        } else {
          value.forEach(item => submissionData.append(`${key}[]`, item));
        }
      } else {
        submissionData.append(key, String(value));
      }
    });

    if (featuredLogo) {
      submissionData.append("featuredLogo", featuredLogo);
    }
    if (screenshots) {
      Array.from(screenshots).forEach((file) => {
        submissionData.append("screenshots", file);
      });
    }

    const result = await dispatch(createGame(submissionData));
    if (createGame.fulfilled.match(result)) {
      router.push("/content/games");
    }
  };

  const handleCancel = () => {
    router.push("/content/games");
  };

  return (

    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
            <Typography variant="h6" fontWeight={600} fontSize={18}>
              Create Casino Game
            </Typography>
          </Box>

      <Box sx={{ p: 2 }}>
      {/* Game Details Section */}
      <Paper
        variant="outlined"
        sx={{ mb: 3, border: `1px solid ${borderColor}` }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ bgcolor: primaryLight ,p: 2, borderRadius: '4px'} }>
          Game Details
        </Typography>
        <Grid container spacing={3} sx={{ p: 2 }}>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="name">Name</CustomFormLabel>
            <CustomTextField
              id="name"
              name="name"
              value={game.name}
              onChange={handleInputChange}
              placeholder="Game name"
              fullWidth
            />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="slug">Slug</CustomFormLabel>
            <CustomTextField
              id="slug"
              name="slug"
              value={game.slug}
              onChange={handleInputChange}
              placeholder="game-slug"
              fullWidth
            />
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="softwareProvider">Software Provider</CustomFormLabel>
            <FormControl fullWidth>
              <InputLabel id="softwareProvider-label">Select Provider</InputLabel>
              <Select
                labelId="softwareProvider-label"
                id="softwareProvider"
                name="softwareProvider"
                value={game.softwareProvider}
                onChange={(e) => handleSelectChange(e, "softwareProvider")}
                input={<OutlinedInput label="Select Provider" />}
              >
                {softwareProviders.map((provider) => (
                  <MenuItem key={provider._id} value={provider._id}>
                    {provider.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="gameType">Game Type</CustomFormLabel>
            <FormControl fullWidth>
              <InputLabel id="gameType-label">Select Game Type</InputLabel>
              <Select
                labelId="gameType-label"
                id="gameType"
                name="gameType"
                value={game.gameType}
                onChange={(e) => handleSelectChange(e, "gameType")}
                input={<OutlinedInput label="Select Game Type" />}
              >
                {gameTypes.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="paylines">Paylines</CustomFormLabel>
            <CustomTextField
              id="paylines"
              name="paylines"
              type="number"
              value={game.paylines}
              onChange={handleInputChange}
              placeholder="25"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="reels">Reels</CustomFormLabel>
            <CustomTextField
              id="reels"
              name="reels"
              type="number"
              value={game.reels}
              onChange={handleInputChange}
              placeholder="5"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="minCoinsPerLine">Min. Coins per Line</CustomFormLabel>
            <CustomTextField
              id="minCoinsPerLine"
              name="minCoinsPerLine"
              type="number"
              value={game.minCoinsPerLine}
              onChange={handleInputChange}
              placeholder="1"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="maxCoinsPerLine">Max. Coins per Line</CustomFormLabel>
            <CustomTextField
              id="maxCoinsPerLine"
              name="maxCoinsPerLine"
              type="number"
              value={game.maxCoinsPerLine}
              onChange={handleInputChange}
              placeholder="10"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="minCoinsSize">Min. Coins Size</CustomFormLabel>
            <CustomTextField
              id="minCoinsSize"
              name="minCoinsSize"
              type="number"
              value={game.minCoinsSize}
              onChange={handleInputChange}
              placeholder="0.01"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="maxCoinsSize">Max. Coins Size</CustomFormLabel>
            <CustomTextField
              id="maxCoinsSize"
              name="maxCoinsSize"
              type="number"
              value={game.maxCoinsSize}
              onChange={handleInputChange}
              placeholder="5"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="rtp">RTP (%)</CustomFormLabel>
            <CustomTextField
              id="rtp"
              name="rtp"
              type="number"
              value={game.rtp}
              onChange={handleInputChange}
              placeholder="96.5"
              fullWidth
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Game Features Section */}
      <Paper
        variant="outlined"
        sx={{ mb: 3, border: `1px solid ${borderColor}` }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ bgcolor: primaryLight ,p: 2, borderRadius: '4px'} }>
          Game Features
        </Typography>
        <Grid container spacing={3} sx={{ p: 2 }}>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel>Bonus Game</CustomFormLabel>
            <Box>
              <FormControlLabel
                control={
                  <CustomSwitch
                    id="bonusGame"
                    name="bonusGame"
                    checked={game.bonusGame}
                    onChange={handleInputChange}
                  />
                }
                label={game.bonusGame ? "Yes" : "No"}
                sx={{ pl: 2 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel>Progressive</CustomFormLabel>
            <Box>
              <FormControlLabel
                control={
                  <CustomSwitch
                    id="progressive"
                    name="progressive"
                    checked={game.progressive}
                    onChange={handleInputChange}
                  />
                }
                label={game.progressive ? "Yes" : "No"}
                sx={{ pl: 2 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel>Wild Symbol</CustomFormLabel>
            <Box>
              <FormControlLabel
                control={
                  <CustomSwitch
                    id="wildSymbol"
                    name="wildSymbol"
                    checked={game.wildSymbol}
                    onChange={handleInputChange}
                  />
                }
                label={game.wildSymbol ? "Yes" : "No"}
                sx={{ pl: 2 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel>Scatter Symbol</CustomFormLabel>
            <Box>
              <FormControlLabel
                control={
                  <CustomSwitch
                    id="scatterSymbol"
                    name="scatterSymbol"
                    checked={game.scatterSymbol}
                    onChange={handleInputChange}
                  />
                }
                label={game.scatterSymbol ? "Yes" : "No"}
                sx={{ pl: 2 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel>Autoplay Option</CustomFormLabel>
            <Box>
              <FormControlLabel
                control={
                  <CustomSwitch
                    id="autoplayOption"
                    name="autoplayOption"
                    checked={game.autoplayOption}
                    onChange={handleInputChange}
                  />
                }
                label={game.autoplayOption ? "Yes" : "No"}
                sx={{ pl: 2 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel>Multiplier</CustomFormLabel>
            <Box>
              <FormControlLabel
                control={
                  <CustomSwitch
                    id="multiplier"
                    name="multiplier"
                    checked={game.multiplier}
                    onChange={handleInputChange}
                  />
                }
                label={game.multiplier ? "Yes" : "No"}
                sx={{ pl: 2 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomFormLabel>Free Spins</CustomFormLabel>
            <Box>
              <FormControlLabel
                control={
                  <CustomSwitch
                    id="freeSpins"
                    name="freeSpins"
                    checked={game.freeSpins}
                    onChange={handleInputChange}
                  />
                }
                label={game.freeSpins ? "Yes" : "No"}
                sx={{ pl: 2 }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Marketing Section */}
      <Paper
        variant="outlined"
        sx={{ mb: 3, border: `1px solid ${borderColor}` }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ bgcolor: primaryLight ,p: 2, borderRadius: '4px'} }>
          Marketing
        </Typography>
        <Grid container spacing={3} sx={{ p: 2 }}>
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="seoTitle">SEO Title</CustomFormLabel>
            <CustomTextField
              id="seoTitle"
              name="seoTitle"
              value={game.seoTitle}
              onChange={handleInputChange}
              placeholder="Best Casino Game 2025"
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
              value={game.metaDescription}
              onChange={handleInputChange}
              placeholder="A short and engaging description for search engines."
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ImageUpload id="featuredLogo" label="Featured Logo" onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null;
              setFeaturedLogo(file);
              if (file) {
                setFeaturedLogoPreview(URL.createObjectURL(file));
              }
            }} />
            {featuredLogoPreview && (
              <img src={featuredLogoPreview} alt="Featured Logo Preview" width="100" style={{ marginTop: '10px',borderRadius: '10px'}} />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <MultiImageUpload
              id="screenshotsGallery"
              label="Screenshots Gallery"
              onChange={(e) => {
                const files = e.target.files;
                setScreenshots(files);
                if (files) {
                  const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
                  setScreenshotPreviews(newPreviews);
                }
              }}
            />
            <Stack direction="row" spacing={1} sx={{ mt: 1, overflowX: 'auto', flexWrap: 'nowrap' }}>
              {screenshotPreviews.map((url, index) => (
                <img key={index} src={url} alt={`Screenshot Preview ${index + 1}`} width="100" style={{ marginTop: '10px',borderRadius: '10px'}}/>
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
              value={game.excerpt}
              onChange={handleInputChange}
              placeholder="A short summary of the game."
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
              value={game.body}
              onChange={handleBodyChange}
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
                  dangerouslySetInnerHTML={{ __html: game.body }}
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
                value={game.tags}
                onChange={(e) => handleMultiSelectChange(e, "tags")}
                input={<OutlinedInput label="Select Tags" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const tag = tags.find((t) => t._id === value);

                      return <Chip key={value} label={tag ? tag.name : value} />;
                    })}
                  </Box>
                )}
              >
                <MenuItem value="select-all">Select All</MenuItem>
                {tags.map((tag) => (
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
                    checked={game.featured}
                    onChange={handleInputChange}
                  />
                }
                label={game.featured ? "Yes" : "No"}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <CustomFormLabel>FAQ</CustomFormLabel>
            <Box>
              {game.faq.map((faqItem, index) => (
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
                    variant="outlined"
                    value={faqItem.question}
                    onChange={(
                      e: ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => handleFaqChange(index, "question", e.target.value)}
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
                    onChange={(
                      e: ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => handleFaqChange(index, "answer", e.target.value)}
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

export default CreateCasinoGame;