import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

export default function QuoteTotalFinalSection({ form }) {
  return (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        borderLeft: "6px solid #009d5b", // color institucional
      }}
    >
      <CardContent>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Total final
          </Typography>

          <Typography
            variant="h5"
            fontWeight={900}
            sx={{ color: "#009d5b" }}
          >
            ${form.total.toLocaleString("es-MX")}
          </Typography>
        </Box>

      </CardContent>
    </Card>
  );
}
