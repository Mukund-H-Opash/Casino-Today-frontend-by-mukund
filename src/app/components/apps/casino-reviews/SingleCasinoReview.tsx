'use client';
import React from 'react';
import { isValidElement } from 'react';
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
  Rating,
  Avatar,
  Paper,
  Divider,
  CardContent,
  TableContainer,
  CircularProgress,
  Button,
} from '@mui/material';
import BlankCard from '@/app/components/shared/BlankCard';
import Link from 'next/link';
import { IconEdit } from '@tabler/icons-react';
import "react-quill/dist/quill.snow.css";

// Base URL for images


// Define the full interface for a single review
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

interface CasinoReview {
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
  withdrawalTimes: string[];
  withdrawalLimits: string[];
  softwareProviders: string[];
  gameTypes: string[];
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  body: string;
  tags: { _id: string; name: string }[];
  isFeatured: boolean;
  faq: FaqItem[];
  customerSupport: CustomerSupport;
  responsibleGambling: ResponsibleGambling;
  featuredLogo?: string;
  screenshots?: string[];
  status: string;
  user: string;
  isEnabled: boolean;
  lastUpdated: string;
  createdAt: string;
  reviewer: {
    _id: string;
    name: string;
    email: string;
  }[];
  bonuses?: { _id: string; name: string; casino: string }[];
}

interface SingleCasinoReviewProps {
  review: CasinoReview;
  reviewData: any;
}

// Helper component for rendering each section's table
const DetailTableCard = ({
  title,
  data,
  reviewData,
}: {
  title: string;
  data: Record<string, any>;
  reviewData: any;
}) => {
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;

  const validEntries = Object.entries(data).filter(
    ([, value]) =>
      value !== undefined &&
      value !== null &&
      value !== '' &&
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
                <TableCell sx={{ width: '35%', verticalAlign: 'baseline' }}>
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
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {value.map((item: any, i: number) => {
                        const colors = [
                          'primary.main',
                          'secondary.main',
                          'error.main',
                          'success.main',
                          'warning.main',
                          'info.main',
                        ];
                        const color = colors[i % colors.length];
                        return (
                          <Chip
                            label={(() => {
                              if (typeof item === 'object' && item !== null) {
                                if ('name' in item) {
                                  return item.name;
                                } else if ('methods' in item) {
                                  return item.methods;
                                } else if ('_id' in item) {
                                  return item._id;
                                }
                              }
                              return String(item);
                            })()}
                            sx={{
                              backgroundColor: color,
                              color: 'white',
                              fontSize: '11px',
                            }}
                            key={item._id || i}
                            size="small"
                          />
                        );
                      })}
                    </Stack>
                  ) : typeof value === 'boolean' ? (
                    <Chip
                      label={value ? 'Yes' : 'No'}
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

const SingleCasinoReview = ({ review, reviewData }: SingleCasinoReviewProps) => {
  const theme = useTheme();
    const primaryLight = theme.palette.primary.light;

  // Ensure rating is a number for the Rating component
  const ratingValue = typeof review.rating === 'string' ? parseFloat(review.rating) : review.rating;

  const firstReviewer = review.reviewer && review.reviewer.length > 0 ? review.reviewer[0] : null;

  const generalData = {
    'Casino Name': review.name,
    Slug: review.slug,
    'Casino URL': review.casinoUrl,
    Rating: <Rating value={ratingValue} readOnly precision={0.5} />,
    Pros: review.pros,
    Cons: review.cons,
    Languages: review.languages,
    'Date Established': review.dateEstablished,
    Licences: review.licences,
    'Casino Type': review.casinoType,
    'Affiliate Program': review.affiliateProgram,
    Company: review.company,
    'Restricted Countries': review.restrictedCountries,
    'Reviewer Name': firstReviewer ? firstReviewer.name : 'N/A',
    'Reviewer Email': firstReviewer ? firstReviewer.email : 'N/A',
    Bonuses: review.bonuses, 
  };

  const paymentsData = {
    'Deposit Methods': review.depositMethods,
    'Withdrawal Methods': review.withdrawalMethods,
    'Withdrawal Times': review.withdrawalTimes,
    'Withdrawal Limits': review.withdrawalLimits,
  };

  const gamesData = {
    'Software Providers': review.softwareProviders,
    'Game Types': review.gameTypes,
  };

  const contentData = {
    'SEO Title': review.seoTitle,
    'Meta Description': review.metaDescription,
    Excerpt: review.excerpt,
    Tags: review.tags,
    'Featured?': review.isFeatured,
  };

  const supportData = {
    'Live Chat Available': review.customerSupport.liveChat,
    Phone: review.customerSupport.phone,
    Email: review.customerSupport.email,
  };

  const responsibleGamblingData = {
    'Deposit Limit': review.responsibleGambling.depositLimit,
    'Self-Exclusion': review.responsibleGambling.selfExclusion,
    Withdrawal: review.responsibleGambling.withdrawal,
  };

  return (
    <BlankCard>
      <Box
          sx={{
            p: 2,
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            borderRadius: "4px",
            bgcolor: primaryLight,
          }}>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={600} >
            View {review.name}
          </Typography>
          <Link href={`/content/casino-reviews/${review._id}/edit`} passHref>
            <Button variant="contained" color="primary" startIcon={<IconEdit />}>
              Edit {review.name}
            </Button>
          </Link>
          
        </Box> 
      
      </Box>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DetailTableCard title="General" data={generalData} reviewData={reviewData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailTableCard title="Payments" data={paymentsData} reviewData={reviewData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailTableCard title="Games" data={gamesData} reviewData={reviewData} />
          </Grid>

          {/* Custom card for Content as it includes images */}
          <Grid item xs={12}>
            <BlankCard>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'primary.light',
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
                          <TableCell sx={{ width: '35%', verticalAlign: 'baseline' }}>
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
                                    'primary.main',
                                    'secondary.main',
                                    'error.main',
                                    'success.main',
                                    'warning.main',
                                    'info.main',
                                    
                                  ];
                                  const color = colors[i % colors.length];
                                  return (
                                    <Chip
                                      label={item.name || item._id}
                                      sx={{
                                        backgroundColor: color,
                                        color: 'white',
                                        fontSize: '11px',
                                      }}
                                      key={i}
                                      size="small"
                                    />
                                  );
                                })}
                              </Stack>
                            ) : typeof value === 'boolean' ? (
                              <Chip
                                label={value ? 'Yes' : 'No'}
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

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Media
                </Typography>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Featured Logo
                    </Typography>
                    {review.featuredLogo ? (
                      <Avatar
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${review.featuredLogo}`}
                        alt="Featured Logo"
                        variant="rounded"
                        sx={{ width: 160, height: 90 }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.png'; // Fallback image
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 160,
                          height: 90,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: theme.palette.grey[200],
                          borderRadius: '4px',
                        }}
                      >
                        <CircularProgress size={24} />
                      </Box>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Screenshots Gallery
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {review.screenshots?.length ? (
                        review.screenshots.map((img: string, index: number) => (
                          <Avatar
                            key={index}
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${img}`}
                            alt={`screenshot ${index + 1}`}
                            sx={{ width: 120, height: 'auto' }}
                            variant="rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-image.png'; // Fallback image
                            }}
                          />
                        ))
                      ) : (
                        <Box
                          sx={{
                            width: 120,
                            height: 80,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: theme.palette.grey[200],
                            borderRadius: '4px',
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
                <Paper variant="outlined" sx={{ p: 2,
                  "& .ql-editor": {
                    padding: 0,
                  },
                }}>
                  <Box className="ql-editor" dangerouslySetInnerHTML={{ __html: review.body || '' }} />
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
                  bgcolor: 'primary.light',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  FAQ
                </Typography>
              </Box>
              <CardContent>
                {review.faq?.length ? (
                  review.faq.map((item: FaqItem, index: number) => (
                    <Box key={item._id || index} mb={2}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {item.question}
                      </Typography>
                      <Typography variant="body2">{item.answer}</Typography>
                      {index < review.faq.length - 1 && <Divider sx={{ my: 2 }} />}
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

          <Grid item xs={12} md={6}>
            <DetailTableCard title="Customer Support" data={supportData} reviewData={reviewData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailTableCard title="Responsible Gambling" data={responsibleGamblingData} reviewData={reviewData} />
          </Grid>
        </Grid>
      </Box>

    </BlankCard>
  );
};

export default SingleCasinoReview;



