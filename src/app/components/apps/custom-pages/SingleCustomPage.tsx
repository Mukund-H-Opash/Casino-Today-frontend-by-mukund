'use client';
import React from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Chip,
  useTheme,
  Grid,
  TableContainer,
  CardContent,
  Paper,
  Button,
} from '@mui/material';
import BlankCard from '@/app/components/shared/BlankCard';
import { CustomPage } from '@/store/apps/custom-pages/CustomPageSlice';
import Link from 'next/link';
import { IconEdit } from '@tabler/icons-react';
import "react-quill/dist/quill.snow.css";


interface SingleCustomPageProps {
  customPage: CustomPage;
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
                  {key === 'Status' ? (
                    <Chip
                      label={value}
                      size="small"
                      sx={{
                        backgroundColor:
                          value === 'enabled'
                            ? theme.palette.primary.light
                            : theme.palette.error.light,
                        color:
                          value === 'enabled'
                            ? theme.palette.primary.main
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
      </TableContainer>
    </BlankCard>
  );
};

const SingleCustomPage = ({ customPage }: SingleCustomPageProps) => {
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;

  const generalInformationData = {
    Title: customPage.title,
    Slug: customPage.slug,
    Status: customPage.status,
  };

  const seoData = {
    'SEO Title': customPage.seoTitle || customPage.title,
    'Meta Description': customPage.metaDescription,
  };

  const contentData = {};

  const authorData = {
    'Author Name': customPage.author?.name || 'user not exists',
    'Author Email': customPage.author?.email || 'email not exists',
  };

  return (
    <BlankCard>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '4px', bgcolor: primaryLight }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600} fontSize={18}>
              View {customPage.title}
            </Typography>
            <Link href={`/content/custom-pages/${customPage._id}/edit`} passHref>
                <Button variant="contained" color="primary" startIcon={<IconEdit />}>
                  Edit {customPage.title}
                </Button>
              </Link>
            </Box>    
            
          </Box>
      <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid container item spacing={3}>
          <Grid item xs={12} md={6}>
            <DetailTableCard title="General Information" data={generalInformationData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailTableCard title="SEO" data={seoData} />
          </Grid>
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
              {customPage.excerpt && (
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Excerpt
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2,
                  "& .ql-editor": {
                    padding: 0,
                  },
                }}>
                    <Box className="ql-editor" dangerouslySetInnerHTML={{ __html: customPage.excerpt }} />
                  </Paper>
                </Box>
              )}
              {customPage.body && (
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Body
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2,
                  "& .ql-editor": {
                    padding: 0,
                  },
                }}>
                    <Box className="ql-editor" dangerouslySetInnerHTML={{ __html: customPage.body }} />
                  </Paper>
                </Box>
              )}
            </CardContent>
          </BlankCard>
        </Grid>
        <Grid item xs={12}>
          <DetailTableCard title="Author" data={authorData} />
        </Grid>
      </Grid>
      </Box>
    </BlankCard>
  );
};

export default SingleCustomPage;