'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import { Membre } from '@/types/membre';
import styles from './BadgeMembre.module.css';

interface BadgeMembreProps {
  membre: Membre;
  onClose: () => void;
}

export default function BadgeMembre({ membre, onClose }: BadgeMembreProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  // Formatage des dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non renseignée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Convertir l'image en Base64
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Générer le QR code en Base64 (simulation car jsPDF ne peut pas générer de QR code directement)
  const generateQRCodeBase64 = async (text: string): Promise<string> => {
    // Utiliser l'API gratuite de QR code
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(text)}&margin=0`;
    const response = await fetch(qrCodeUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  // Générer le PDF
  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      // Format badge: 90mm x 55mm (carte de crédit)
      const doc = new jsPDF({
        unit: 'mm',
        format: [90, 55],
      });

      // Couleurs
      const darkBlue = '#1e3c72';
      const lightBlue = '#2a5298';
      const gold = '#FFD700';
      
      // Fond dégradé manuel
      doc.setFillColor(30, 60, 114); // #1e3c72
      doc.rect(0, 0, 90, 55, 'F');
      
      // Dégradé vers le bas
      doc.setFillColor(42, 82, 152); // #2a5298
      doc.rect(0, 27, 90, 28, 'F');

      // En-tête
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('MAFAMI', 8, 10);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Membre officiel', 8, 15);
      
      // Année
      doc.setFillColor(255, 215, 0); // Or
      doc.roundedRect(72, 6, 15, 10, 2, 2, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('2026', 76, 13);

      // Photo d'identité
      if (photoBase64) {
        try {
          doc.addImage(photoBase64, 'JPEG', 8, 20, 20, 20, undefined, 'FAST');
          // Bordure autour de la photo
          doc.setDrawColor(255, 215, 0);
          doc.setLineWidth(0.5);
          doc.rect(8, 20, 20, 20);
        } catch (error) {
          console.error('Erreur chargement photo:', error);
          
          drawDefaultAvatar(doc, 8, 20, 20);
        }
      } else {
        drawDefaultAvatar(doc, 8, 20, 20);
      }

      // Informations principales
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${membre.nom} ${membre.prenom}`, 33, 25);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`N° ${membre.id_membre}`, 33, 30);

      // QR Code
      const qrText = "MAFAMI TOLIARA 2026 COMPLET";
      const qrBase64 = await generateQRCodeBase64(qrText);
      doc.addImage(qrBase64, 'PNG', 60, 38, 12, 12);
      
      // Texte du QR code
      doc.setFontSize(6);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 215, 0);
      doc.text('MAFAMI TOLIARA', 58, 35);
      doc.setFontSize(5);
      doc.setTextColor(255, 255, 255);
      doc.text('2026 COMPLET', 60, 37);

      // Informations détaillées (fond semi-transparent)
      doc.setFillColor(255, 255, 255, 0.15);
      doc.roundedRect(33, 33, 45, 18, 2, 2, 'F');
      
      // Lignes d'information
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      
      doc.text(`Filière: ${membre.filiere || 'Non renseignée'}`, 35, 38);
      doc.text(`Niveau: ${membre.niveau_etude || 'Non renseigné'}`, 35, 43);
      doc.text(`Région: ${membre.region_origine || 'Non renseignée'}`, 35, 48);
      doc.text(`Tél: ${membre.telephone || 'Non renseigné'}`, 35, 53);

      // Pied de page
      doc.setFontSize(6);
      doc.setTextColor(200, 200, 200);
      doc.text('Valable pour l\'année 2026', 8, 52);
      doc.text('Association MAFAMI Toliara', 8, 54);

      // Sauvegarde
      doc.save(`badge_${membre.nom}_${membre.prenom}.pdf`);
      
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      alert('Erreur lors de la génération du PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  // Avatar par défaut
  const drawDefaultAvatar = (doc: jsPDF, x: number, y: number, size: number) => {
    doc.setFillColor(200, 200, 200);
    doc.rect(x, y, size, size, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(12);
    doc.text('📷', x + size/2 - 2, y + size/2 + 2);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            🪪 Génération du Badge - {membre.nom} {membre.prenom}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {/* Upload photo */}
          <div className={styles.photoSection}>
            <label className={styles.photoLabel}>
              {photoBase64 ? (
                <div className={styles.photoPreview}>
                  <img src={photoBase64} alt="Photo" />
                  <span>Changer la photo</span>
                </div>
              ) : (
                <div className={styles.photoPlaceholder}>
                  <span>📸</span>
                  <span>Ajouter une photo</span>
                  <small>Format carré recommandé</small>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Infos du badge */}
          <div className={styles.infoSection}>
            <h3>Aperçu des informations</h3>
            <div className={styles.infoList}>
              <p><strong>Nom:</strong> {membre.nom} {membre.prenom}</p>
              <p><strong>ID:</strong> {membre.id_membre}</p>
              <p><strong>Filière:</strong> {membre.filiere || 'Non renseignée'}</p>
              <p><strong>Niveau:</strong> {membre.niveau_etude || 'Non renseigné'}</p>
              <p><strong>Téléphone:</strong> {membre.telephone || 'Non renseigné'}</p>
              <p><strong>QR Code:</strong> MAFAMI TOLIARA 2026 COMPLET</p>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.btnPrimary}
            onClick={generatePDF}
            disabled={isGenerating}
          >
            {isGenerating ? '⏳ Génération...' : '📄 Générer le Badge PDF'}
          </button>
          <button 
            className={styles.btnSecondary}
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}