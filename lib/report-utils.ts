import { CreditSelect, DebtorSelect, UserSelect } from "@/lib/store";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export type ReportFormat = "csv" | "pdf";

export type DateRange = {
  from: Date;
  to: Date;
};

export type ReportData = {
  credits: CreditSelect[];
  debtors: DebtorSelect[];
  dateRange: DateRange;
  selectedDebtorId?: string;
  user: UserSelect;
  formatCurrency: (amount: number | string) => string;
};

/**
 * Generate a CSV report from credit data
 */
export const generateCSVReport = (data: ReportData): string => {
  const { credits, debtors, dateRange, selectedDebtorId, formatCurrency } =
    data;

  // Filter credits by date range and debtor if selected
  let filteredCredits = credits.filter((credit) => {
    const creditDate = new Date(credit.date);
    return creditDate >= dateRange.from && creditDate <= dateRange.to;
  });

  // Filter by debtor if not "all"
  if (selectedDebtorId && selectedDebtorId !== "all") {
    filteredCredits = filteredCredits.filter(
      (credit) => credit.debtorId === selectedDebtorId
    );
  }

  // Create CSV header
  const csvRows = [
    [
      "Date",
      "Debtor",
      "Type",
      "Item",
      "Quantity",
      "Price",
      "Amount",
      "Status",
    ].join(","),
  ];

  // Add data rows
  filteredCredits.forEach((credit) => {
    const debtor = debtors.find((d) => d.id === credit.debtorId);
    const debtorName = debtor?.name || "Unknown";
    const status = credit.isPaid ? "Paid" : "Unpaid";
    const formattedDate = format(new Date(credit.date), "yyyy-MM-dd");

    const row = [
      formattedDate,
      `"${debtorName}"`, // Wrap in quotes to handle commas in names
      credit.type,
      `"${credit.item || ""}"`, // Wrap in quotes to handle commas in item names
      credit.quantity || "",
      credit.price ? formatCurrency(credit.price).replace(/[^\d.-]/g, "") : "",
      formatCurrency(credit.amount).replace(/[^\d.-]/g, ""),
      status,
    ];

    csvRows.push(row.join(","));
  });

  // Add summary section
  csvRows.push("");
  csvRows.push("Summary");

  // Calculate totals
  const totalPurchases = filteredCredits
    .filter((credit) => credit.type === "purchase")
    .reduce((sum, credit) => sum + Number(credit.amount), 0);

  const totalPayments = filteredCredits
    .filter((credit) => credit.type === "payment")
    .reduce((sum, credit) => sum + Number(credit.amount), 0);

  const paidPurchases = filteredCredits
    .filter((credit) => credit.type === "purchase" && credit.isPaid)
    .reduce((sum, credit) => sum + Number(credit.amount), 0);

  const unpaidPurchases = filteredCredits
    .filter((credit) => credit.type === "purchase" && !credit.isPaid)
    .reduce((sum, credit) => sum + Number(credit.amount), 0);

  csvRows.push(
    `"Total Purchases",${formatCurrency(totalPurchases).replace(
      /[^\d.-]/g,
      ""
    )}`
  );
  csvRows.push(
    `"Total Payments",${formatCurrency(totalPayments).replace(/[^\d.-]/g, "")}`
  );
  csvRows.push(
    `"Paid Purchases",${formatCurrency(paidPurchases).replace(/[^\d.-]/g, "")}`
  );
  csvRows.push(
    `"Unpaid Purchases",${formatCurrency(unpaidPurchases).replace(
      /[^\d.-]/g,
      ""
    )}`
  );
  csvRows.push(
    `"Outstanding Balance",${formatCurrency(
      Math.max(0, unpaidPurchases - totalPayments)
    ).replace(/[^\d.-]/g, "")}`
  );

  return csvRows.join("\n");
};

/**
 * Create a download link for a file
 */
export const downloadFile = (
  data: string,
  fileName: string,
  mimeType: string
) => {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate a PDF report from credit data
 */
export const generatePDFReport = async (
  reportElement: HTMLElement,
  fileName: string
): Promise<void> => {
  try {
    // Capture the report element as an image
    const canvas = await html2canvas(reportElement, {
      scale: 3, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    // Calculate PDF dimensions (A4 format)
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    // Handle multi-page if content is longer than a single page
    let heightLeft = imgHeight;
    let position = 0;
    let pageNumber = 1;

    // Add first page
    pdf.addImage(
      canvas,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight,
      `report-${pageNumber}`,
      "FAST"
    );
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = -pageHeight * pageNumber;
      pageNumber++;
      pdf.addPage();
      pdf.addImage(
        canvas,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
        `report-${pageNumber}`,
        "FAST"
      );
      heightLeft -= pageHeight;
    }

    // Save PDF
    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
