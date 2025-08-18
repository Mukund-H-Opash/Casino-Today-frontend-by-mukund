'use client';
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
import "react-quill/dist/quill.snow.css";
import { Bonus } from "@/store/apps/bonuses/bonuseSlice";
import Link from 'next/link';
import { IconEdit } from '@tabler/icons-react';
import "react-quill/dist/quill.snow.css";

interface SingleCasinoBonusProps {
  bonus: Bonus;
}

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
                  {Array.isArray(value) ? (
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
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
                   ) : typeof value === 'object' && value !== null && !isValidElement(value) ? (
                    <Typography variant="body2">{value.name}</Typography>
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

const SingleCasinoBonus = ({ bonus }: SingleCasinoBonusProps) => {
  const theme = useTheme();
 const primaryLight = theme.palette.primary.light;
  const generalData = {
    "Bonus Name": bonus.name,
    Slug: bonus.slug,
    Casino: bonus.casino,
    "Bonus Type": bonus.bonusType,
    "Minimum Deposit": bonus.minimumDeposit,
    "Bonus Code": bonus.bonusCode,
    "Wagering Requirements": bonus.wageringRequirements,
    "Maximum Bonus Amount": bonus.maximumBonusAmount,
    "Maximum Cashout": bonus.maximumCashout,
    "Bonus Value": bonus.bonusValue,
    "Allowed Games": bonus.allowedGames,
    
  };

  const contentData = {
    "SEO Title": bonus.seoTitle,
    "Meta Description": bonus.metaDescription,
    Excerpt: bonus.excerpt,
    Tags: bonus.tags,
    Featured: bonus.featured,
    URL: bonus.url,
  };

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600} fontSize={18}>
              View {bonus.name}
            </Typography>
            <Link href={`/content/bonuses/${bonus._id}/edit`} passHref>
            <Button variant="contained" color="primary" startIcon={<IconEdit />}>
              Edit {bonus.name}
            </Button>
            </Link>
            </Box>
      </Box>
      <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DetailTableCard title="General" data={generalData} />
        </Grid>

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
                Content
              </Typography>
            </Box>
            <CardContent>
              <Table>
                <TableBody>
                  {Object.entries(contentData)
                    .filter(([, value]) => value !== undefined)
                    .map(([key, value]) => (
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
                          {Array.isArray(value) ? (
                            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
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
                          ) : (
                            <Typography variant="body2">{String(value)}</Typography>
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
                {bonus.featuredImage ? (
                    <Avatar
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${bonus.featuredImage}`}
                      alt="Featured Image"
                      variant="rounded"
                      sx={{ width: 160, height: 90 }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                        No image
                    </Typography>
                  )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Additional Information
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2">{bonus.additionalInformation || "N/A"}</Typography>
              </Paper>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Body
              </Typography>
              <Paper variant="outlined" sx={{ p: 2,
                  "& .ql-editor": {
                    padding: 0,
                  },
                }}>
                <Box className="ql-editor" dangerouslySetInnerHTML={{ __html: bonus.body || "" }} />
              </Paper>
            </CardContent>
          </BlankCard>
        </Grid>

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
              {bonus.faq?.length ? (
                bonus.faq.map((item, index) => (
                  <Box key={item._id || index} mb={2}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {item.question}
                    </Typography>
                    <Typography variant="body2">{item.answer}</Typography>
                    {index < bonus.faq.length - 1 && <Divider sx={{ my: 2 }} />}
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

export default SingleCasinoBonus;