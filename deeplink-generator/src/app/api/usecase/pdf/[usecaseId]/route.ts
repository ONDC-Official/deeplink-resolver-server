import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getUsecaseById } from "@/app/actions";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ usecaseId: string }> }
) {
	try {
		const usecaseId = (await params).usecaseId;
		const usecase = await getUsecaseById(usecaseId);
		if (!usecase)
			return NextResponse.json({ error: "Usecase not found" }, { status: 404 });
		const { value } = usecase;
		const qrCodeBase64 = await QRCode.toDataURL(JSON.stringify(value, null, 2));

		// Remove data:image/png;base64 prefix
		const qrCodeImageBytes = Buffer.from(qrCodeBase64.split(",")[1], "base64");

		// Load template PDF
		const templatePath = path.join(process.cwd(), "public", "Poster.pdf");
		const templateBytes = fs.readFileSync(templatePath);

		// Load the template PDF
		const pdfDoc = await PDFDocument.load(templateBytes);

		// Embed the QR code image
		const qrCodeImage = await pdfDoc.embedPng(qrCodeImageBytes);

		// Get the first page
		const page = pdfDoc.getPages()[0];

		// Calculate center position
		const { width, height } = page.getSize();
		const qrSize = 150;
		const x = (width - qrSize) / 2 + 20;
		const y = (height - qrSize) / 2 + 140;

		// Draw QR code
		page.drawImage(qrCodeImage, {
			x,
			y,
			width: qrSize,
			height: qrSize,
		});

		// Save the PDF
		const pdfBytes = await pdfDoc.save();

		return new NextResponse(pdfBytes, {
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `attachment; filename=${usecase.name || "Deep Link"}.pdf`,
			},
		});
	} catch (error) {
		console.error("Error:", error);
		return NextResponse.json(
			{ error: "Error generating PDF" },
			{ status: 500 }
		);
	}
}
