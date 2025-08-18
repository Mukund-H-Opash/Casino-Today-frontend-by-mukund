"use client";
import React from "react";
import { isValidElement } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Chip,
  Stack,
  useTheme,
  Grid,
  Avatar,
  Paper,
  Divider,
  CardContent,
  TableContainer,
  Button,
} from "@mui/material";
import BlankCard from "@/app/components/shared/BlankCard";
import Link from 'next/link';
import { IconEdit } from '@tabler/icons-react';
import "react-quill/dist/quill.snow.css";
import { Game } from "@/store/apps/games/gameSlice";



// Define the interface for a single game, matching backend response
interface SingleCasinoGameProps {
  game: Game;
}

// Helper component for rendering each section's table
const DetailTableCard = ({
  title,
  data,
}: {
  title: string;
  data: Record<string, any>;
}) => {
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;

  const validEntries = Object.entries(data).filter(
    ([, value]) =>
      value !== undefined &&
      value !== null &&
      value !== "" &&
      (!Array.isArray(value) || value.length > 0)
  );

  if (validEntries.length === 0) return null;

  return (
    <BlankCard>
      <Box
        sx={{
          p: 2,
          bgcolor: primaryLight,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </Box>
      <TableContainer>
        <Table>
          <TableBody>
            {validEntries.map(([key, value]) => (
              <TableRow key={key}>
                <TableCell sx={{ width: "35%", verticalAlign: "baseline" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="600"
                    color="text.secondary"
                  >
                    {key}
                  </Typography>
                </TableCell>
                <TableCell>
                  {Array.isArray(value) && !isValidElement(value) ? (
                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      flexWrap="wrap"
                    >
                      {value.map((item, i) => {
                        const colors = [
                          "primary.main",
                          "secondary.main",
                          "error.main",
                          "success.main",
                          "warning.main",
                        ];
                        const color = colors[i % colors.length];
                        return (
                          <Chip
                            label={item.name || item}
                            sx={{
                              backgroundColor: color,
                              color: "white",
                              fontSize: "11px",
                            }}
                            key={i}
                            size="small"
                          />
                        );
                      })}
                    </Stack>
                  ) : typeof value === "boolean" ? (
                    <Chip
                      label={value ? "Yes" : "No"}
                      size="small"
                      sx={{
                        backgroundColor: value
                          ? theme.palette.success.light
                          : theme.palette.error.light,
                        color: value
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                      }}
                    />
                  ) : isValidElement(value) ? (
                    value
                  ) : (
                    <Typography variant="body2">{String(value)}</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </BlankCard>
  );
};

const SingleCasinoGame = ({ game }: SingleCasinoGameProps) => {
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;

  const gameDetailsData = {
    "Game Name": game.name,
    Slug: game.slug,
    "Software Provider": game.softwareProvider ? game.softwareProvider.name : 'N/A',
    "Game Type": game.gameType ? game.gameType.name : 'N/A',
    Paylines: game.paylines,
    Reels: game.reels,
    "Min Coins per Line": game.minCoinsPerLine,
    "Max Coins per Line": game.maxCoinsPerLine,
    "Min Coins Size": game.minCoinsSize,
    "Max Coins Size": game.maxCoinsSize,
    RTP: game.rtp ? `${game.rtp}%` : undefined,
 
  };

  const gameFeaturesData = {
    "Bonus Game": game.bonusGame,
    Progressive: game.progressive,
    "Wild Symbol": game.wildSymbol,
    "Scatter Symbol": game.scatterSymbol,
    "Autoplay Option": game.autoplayOption,
    Multiplier: game.multiplier,
    "Free Spins": game.freeSpins,
  };

  const marketingData = {
    "SEO Title": game.seoTitle,
    "Meta Description": game.metaDescription,
    Excerpt: game.excerpt,
    Tags: game.tags,
    Featured: game.featured,
  };

  return (
    <BlankCard>
    
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={600} fontSize={18}>
          View {game.name}
        </Typography>
        <Link href={`/content/games/${game._id}/edit`} passHref>
            <Button variant="contained" color="primary" startIcon={<IconEdit />}>
              Edit {game.name}
            </Button>
          </Link>
        </Box>
      </Box>

      <Box  sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid container item spacing={3}>
          <Grid item xs={12} md={6}>
            <DetailTableCard title="Game Details" data={gameDetailsData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailTableCard title="Game Features" data={gameFeaturesData} />
          </Grid>
        </Grid>

        {/* Custom card for Marketing as it includes images */}
        <Grid item xs={12}>
          <BlankCard>
            <Box
              sx={{
                p: 2,
                bgcolor: "primary.light",
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Marketing
              </Typography>
            </Box>
            <CardContent>
              <Table>
                <TableBody>
                  {Object.entries(marketingData)
                    .filter(([, value]) => value !== undefined)
                    .map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell
                          sx={{ width: "35%", verticalAlign: "baseline" }}
                        >
                          <Typography
                            variant="subtitle2"
                            fontWeight="600"
                            color="text.secondary"
                          >
                            {key}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {Array.isArray(value) ? (
                            <Stack
                              direction="row"
                              spacing={1}
                              useFlexGap
                              flexWrap="wrap"
                            >
                              {value.map((item: any, i: number) => {
                                const colors = [
                                  "primary.main",
                                  "secondary.main",
                                  "error.main",
                                  "success.main",
                                  "warning.main",
                                ];
                                const color = colors[i % colors.length];
                                return (
                                  <Chip
                                    label={item.name || item}
                                    sx={{
                                      backgroundColor: color,
                                      color: "white",
                                      fontSize: "11px",
                                    }}
                                    key={i}
                                    size="small"
                                  />
                                );
                              })}
                            </Stack>
                          ) : typeof value === "boolean" ? (
                            <Chip
                              label={value ? "Yes" : "No"}
                              size="small"
                              sx={{
                                backgroundColor: value
                                  ? theme.palette.success.light
                                  : theme.palette.error.light,
                                color: value
                                  ? theme.palette.success.main
                                  : theme.palette.error.main,
                              }}
                            />
                          ) : isValidElement(value) ? (
                            value
                          ) : (
                            <Typography variant="body2">
                              {String(value)}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Media
              </Typography>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Featured Logo
                  </Typography>
                  <Avatar
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${game.featuredLogo}`}
                    alt="Featured Logo"
                    variant="rounded"
                    sx={{ width: 160, height: 90 }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-image.png";
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Screenshots Gallery
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {game.screenshots?.length ? (
                      game.screenshots.map((img, index) => (
                        <Avatar
                          key={index}
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${img}`}
                          alt={`screenshot ${index + 1}`}
                          sx={{ width: 120, height: 90 }}
                          variant="rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder-image.png";
                          }}
                        />
                      ))
                    ) : (
                      <Box
                        sx={{
                          width: 120,
                          height: 90,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: theme.palette.grey[200],
                          borderRadius: "4px",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          No screenshots
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Body
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  "& .ql-editor": {
                    padding: 0,
                  },
                }}
              >
                <Box
                  className="ql-editor"
                  dangerouslySetInnerHTML={{ __html: game.body || "" }}
                />
              </Paper>
            </CardContent>
          </BlankCard>
        </Grid>

        {/* Custom card for FAQ */}
        <Grid item xs={12}>
          <BlankCard>
            <Box
              sx={{
                p: 2,
                bgcolor: "primary.light",
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                FAQ
              </Typography>
            </Box>
            <CardContent>
              {game.faq?.length ? (
                game.faq.map((item: { question: string, answer: string }, index: number) => (
                  <Box key={index} mb={2}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {item.question}
                    </Typography>
                    <Typography variant="body2">{item.answer}</Typography>
                    {index < (game.faq?.length || 0) - 1 && (
                      <Divider sx={{ my: 2 }} />
                    )}
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No FAQs available
                </Typography>
              )}
            </CardContent>
          </BlankCard>
        </Grid>
      </Grid>
      </Box>
    
    </BlankCard>
  );
};

export default SingleCasinoGame;