import {
    cert,
    getApps,
    initializeApp,
} from "firebase-admin/app";

import serviceAccount from "@/secrets/firebase-service-account.json";

console.log(
    "[Firebase Admin Project]",
    serviceAccount.project_id
);

const adminApp =
    getApps().length > 0
        ? getApps()[0]
        : initializeApp({
              credential: cert(serviceAccount),
          });

export { adminApp };