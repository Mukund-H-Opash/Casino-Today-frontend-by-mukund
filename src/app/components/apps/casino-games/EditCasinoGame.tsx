"use client";
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
import { useSelector } from "react-redux";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import { toast } from "react-toastify";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSwitch from "@/app/components/forms/theme-elements/CustomSwitch";
import {
  Game,
  updateGame,
  fetchGameCreateData,
} from "@/store/apps/games/gameSlice";
import { RootState, useAppDispatch } from "@/store/store";
import BlankCard from "../../shared/BlankCard";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

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

interface FaqItem {
  question: string;
  answer: string;
  _id?: string;
}

const EditCasinoGame = ({
  game: initialGame,
  isLoading,
  error,
}: {
  game: Game | null;
  isLoading: boolean;
  error: string | null;
}) => {
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;
  const borderColor = theme.palette.divider;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading: sliceIsLoading, error: sliceError } = useSelector(
    (state: RootState) => state.games
  );

  const defaultGame: Game = {
    _id: "",
    name: "",
    slug: "",
    softwareProvider: { _id: "", name: "" },
    gameType: { _id: "", name: "" },
    paylines: 0,
    reels: 0,
    minCoinsPerLine: 0,
    maxCoinsPerLine: 0,
    minCoinsSize: 0,
    maxCoinsSize: 0,
    rtp: 0,
    bonusGame: false,
    progressive: false,
    wildSymbol: false,
    scatterSymbol: false,
    autoplayOption: false,
    multiplier: false,
    freeSpins: false,
    seoTitle: "",
    metaDescription: "",
    featuredLogo: "",
    screenshots: [],
    excerpt: "",
    body: "",
    tags: [],
    featured: false,
    faq: [],
    status: "",
    createdAt: "",
    updatedAt: "",
  };

  const [game, setGame] = useState<Game>(initialGame || defaultGame);
  const [featuredLogo, setFeaturedLogo] = useState<File | null>(null);
  const [screenshots, setScreenshots] = useState<FileList | null>(null);
  const [removedFaqIds, setRemovedFaqIds] = useState<string[]>([]);
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
  }, []);

  useEffect(() => {
    // Cleanup object URLs on unmount
    return () => {
      if (featuredLogoPreview) {
        URL.revokeObjectURL(featuredLogoPreview);
      }
      screenshotPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [featuredLogoPreview, screenshotPreviews]);

  useEffect(() => {
    if (initialGame) {
      setGame(initialGame);
    }
  }, [initialGame]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading game data...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!initialGame) {
    return <Typography color="error">Game not found</Typography>;
  }

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
    } else if (
      [
        "paylines",
        "reels",
        "minCoinsPerLine",
        "maxCoinsPerLine",
        "minCoinsSize",
        "maxCoinsSize",
        "rtp",
      ].includes(name)
    ) {
      const numValue = parseFloat(value);
      if (value === "" || (!isNaN(numValue) && numValue > 0)) {
        setGame({ ...game, [name]: value });
      } else {
        toast.error(
          `Invalid input for ${name}. Please enter a positive number.`
        );
      }
    } else {
      setGame({
        ...game,
        [name]: type === "checkbox" || type === "switch" ? checked : value,
      });
    }
  };

  const handleSelectChange = (
    event: SelectChangeEvent<string>,
    name: keyof Game
  ) => {
    const { value } = event.target;
    setGame({ ...game, [name]: value });
  };

  const handleMultiSelectChange = (
    event: SelectChangeEvent<string[]>,
    name: keyof Game
  ) => {
    const {
      target: { value },
    } = event;
    let newValues: any[] = [];

    if (typeof value === "string") {
      newValues = value.split(",");
    } else {
      newValues = value;
    }

    if (newValues.includes("select-all")) {
      switch (name) {
        case "tags":
          setGame({
            ...game,
            [name]: tags.map((tag) =>
              typeof tag === "string" ? tag : tag._id
            ),
          });
          break;
        default:
          setGame({
            ...game,
            [name]: newValues.filter((val) => val !== "select-all"),
          });
          break;
      }
    } else {
      setGame({ ...game, [name]: newValues });
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
    const removedFaq = newFaq.splice(index, 1)[0];
    setGame({ ...game, faq: newFaq });
    if (removedFaq._id) {
      setRemovedFaqIds([...removedFaqIds, removedFaq._id]);
      toast.info("FAQ removed. Save to apply changes.");
    }
  };

  const handleSave = async () => {
    if (!game.name) {
      toast.error("Game Name is a required field.");
      return;
    }
    if (
      parseFloat(String(game.minCoinsPerLine)) >=
      parseFloat(String(game.maxCoinsPerLine))
    ) {
      toast.error("Min coins per line must be less than max coins per line.");
      return;
    }

    if (
      parseFloat(String(game.minCoinsSize)) >=
      parseFloat(String(game.maxCoinsSize))
    ) {
      toast.error("Min coin size must be less than max coin size.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("id", game._id);

    // Handle file changes
    if (featuredLogo) {
      submissionData.append("featuredLogo", featuredLogo);
    }
    if (screenshots) {
      Array.from(screenshots).forEach((file) => {
        submissionData.append("screenshots", file);
      });
    }

    // Always append the faq data, even if it's an empty array
    submissionData.append("faq", JSON.stringify(game.faq));

    // Append removed FAQ IDs
    if (removedFaqIds.length > 0) {
      removedFaqIds.forEach((id) => {
        submissionData.append("removedFaqIds[]", id);
      });
    }

    // Append other changed fields
    const keys = Object.keys(game) as (keyof Game)[];
    for (const key of keys) {
      if (
        key === "_id" ||
        key === "featuredLogo" ||
        key === "screenshots" ||
        key === "faq"
      ) {
        continue;
      }

      const currentValue = game?.[key];
      const initialValue = initialGame[key];

      if (JSON.stringify(currentValue) !== JSON.stringify(initialValue)) {
        if (Array.isArray(currentValue)) {
          currentValue.forEach((item) => {
            submissionData.append(`${key}[]`, String(item));
          });
        } else if (currentValue !== undefined) {
          submissionData.append(key, String(currentValue));
        }
      }
    }

    // Log FormData for debugging
    const formDataEntries: Record<string, any> = {};
    submissionData.forEach((value, key) => {
      formDataEntries[key] = value;
    });
    // console.log('FormData payload:', formDataEntries);

    try {
      await dispatch(
        updateGame({ id: game._id, gameData: submissionData })
      ).unwrap();
      router.push("/content/games");
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    router.push("/content/games");
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
          Edit {game.name}
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Paper
          variant="outlined"
          sx={{ mb: 3, border: `1px solid ${borderColor}` }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ bgcolor: primaryLight, p: 2, borderRadius: "4px" }}
          >
            Game Details
          </Typography>
          <Grid container spacing={3} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="name">Game Name</CustomFormLabel>
              <CustomTextField
                id="name"
                name="name"
                value={game.name}
                onChange={handleInputChange}
                placeholder="Mega Moolah"
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
              placeholder="mega-moolah"
              fullWidth
            />
          </Grid> */}
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="softwareProvider">
                Software Provider
              </CustomFormLabel>
              <FormControl fullWidth>
                <InputLabel id="softwareProvider-label">
                  Select Provider
                </InputLabel>
                <Select
                  labelId="softwareProvider-label"
                  id="softwareProvider"
                  name="softwareProvider"
                  value={
                    typeof game.softwareProvider === "object"
                      ? game.softwareProvider._id
                      : game.softwareProvider
                  }
                  onChange={(e) => handleSelectChange(e, "softwareProvider")}
                  input={<OutlinedInput label="Select Provider" />}
                >
                  <MenuItem value="" disabled>
                    Select Provider
                  </MenuItem>
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
                  value={
                    typeof game.gameType === "object"
                      ? game.gameType._id
                      : game.gameType
                  }
                  onChange={(e) => handleSelectChange(e, "gameType")}
                  input={<OutlinedInput label="Select Game Type" />}
                >
                  <MenuItem value="" disabled>
                    Select Game Type
                  </MenuItem>
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
              <CustomFormLabel htmlFor="minCoinsPerLine">
                Min Coins per Line
              </CustomFormLabel>
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
              <CustomFormLabel htmlFor="maxCoinsPerLine">
                Max Coins per Line
              </CustomFormLabel>
              <CustomTextField
                id="maxCoinsPerLine"
                name="maxCoinsPerLine"
                type="number"
                value={game.maxCoinsPerLine}
                onChange={handleInputChange}
                placeholder="5"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="minCoinsSize">
                Min Coins Size
              </CustomFormLabel>
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
              <CustomFormLabel htmlFor="maxCoinsSize">
                Max Coins Size
              </CustomFormLabel>
              <CustomTextField
                id="maxCoinsSize"
                name="maxCoinsSize"
                type="number"
                value={game.maxCoinsSize}
                onChange={handleInputChange}
                placeholder="1"
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
            {/* <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="status">Status</CustomFormLabel>
            <FormControl fullWidth>
              <InputLabel id="status-label">Select Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={game.status}
                onChange={(e) => handleSelectChange(e, 'status')}
                input={<OutlinedInput label="Select Status" />}
              >
                <MenuItem value="" disabled>
                  Select Status
                </MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}
          </Grid>
        </Paper>

        <Paper
          variant="outlined"
          sx={{ mb: 3, border: `1px solid ${borderColor}` }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ bgcolor: primaryLight, p: 2, borderRadius: "4px" }}
          >
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

        <Paper
          variant="outlined"
          sx={{ mb: 3, border: `1px solid ${borderColor}` }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ bgcolor: primaryLight, p: 2, borderRadius: "4px" }}
          >
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
                placeholder="Mega Moolah Slot Review 2025"
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
              <ImageUpload
                id="featuredLogo"
                label="Featured Logo"
                onChange={handleFileChange}
              />
              {featuredLogoPreview ? (
                <img
                  src={featuredLogoPreview}
                  alt="New Featured Logo Preview"
                  width="100" height={80}
                  style={{ marginTop: "10px", borderRadius: "10px" }}
                />
              ) : (
                game.featuredLogo && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${game.featuredLogo}`}
                    alt="Current Featured Logo"
                    width="100" height={80}
                    style={{ marginTop: "10px", borderRadius: "10px" }}
                  />
                )
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <MultiImageUpload
                id="screenshots"
                label="Screenshots Gallery"
                onChange={handleFileChange}
              />
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {screenshotPreviews.length > 0
                  ? screenshotPreviews.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`New Screenshot Preview ${index + 1}`}
                        width="100" height={80}
                         style={{ marginTop: "10px", borderRadius: "10px" }}
                      />
                    ))
                  : game.screenshots?.map((img: string, index: number) => (
                      <img
                        key={index}
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${img}`}
                        alt={`Current Screenshot ${index + 1}`}
                        width="100" height={80}
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
                  value={game.body}
                  onChange={(value) => setGame({ ...game, body: value })}
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
                    borderRadius: "4px",
                    "& .ql-editor": {
                      padding: 0,
                    },
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
                  value={(game.tags || []).map((t) =>
                    typeof t === "object" ? t._id : t
                  )}
                  onChange={(e) => handleMultiSelectChange(e, "tags")}
                  input={<OutlinedInput label="Select Tags" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected || []).map((value) => (
                        <Chip
                          key={value}
                          label={
                            tags.find((t: any) => t._id === value)?.name ||
                            value
                          }
                        />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="select-all">Select All</MenuItem>
                  {tags.map((tag: any) => (
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
                {game.faq.map((faqItem: FaqItem, index: number) => (
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
                      onChange={(e: { target: { value: string } }) =>
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
                      onChange={(e: { target: { value: string } }) =>
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

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={sliceIsLoading}
          >
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

export default EditCasinoGame;
