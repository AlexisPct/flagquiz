# 🌍 Flag Quiz

Bienvenue sur **Flag Quiz**, une application web moderne et modulaire dédiée à la découverte géographique et au jeu. Ce projet combine un outil d'exploration du monde (Atlas) et un moteur de quiz interactif proposant différents modes de jeu et niveaux de difficulté.

Cette plateforme est développée de manière unifiée au sein de ce **monorepo**, regroupant le serveur d'API et l'interface utilisateur.

---

## 🛠️ Architecture Technologique

L'application repose sur une séparation stricte des préoccupations, garantissant performance, typage fort et maintenance simplifiée :

*   **Frontend :** React, TypeScript, React Router, Architecture pilotée par les Services.
*   **Backend :** Node.js, Express, TypeScript, REST API.
*   **Design & UI :** CSS3 Moderne avec gestion dynamique des thèmes (*Light / Dark mode*) via variables natives, composants d'autocomplétion sur-mesure.

---

## 📂 Structure du Projet

```text
flagquiz/
├── backend/          # Serveur Node.js / Express (Moteur du quiz & API géographiques)
├── frontend/         # Application React / TypeScript (Interface utilisateur & Services front)