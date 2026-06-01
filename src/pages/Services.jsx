import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Shield, Heart, Briefcase, Users, GraduationCap, Building2, Star, Clock, CreditCard, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: FileText,
    title: "Barangay Clearance",
    desc: "Official clearance document for various purposes including employment, business, and legal transactions.",
    requirements: ["Valid ID", "Cedula/Community Tax Certificate", "2x2 ID Photo"],
    fee: "₱50.00",
    processing: "15–30 minutes",
  },
  {
    icon: Shield,
    title: "Certificate of Residency",
    desc: "Certifies that the applicant is a bona fide resident of Barangay San Vicente.",
    requirements: ["Valid ID", "Proof of Residence"],
    fee: "₱50.00",
    processing: "15–30 minutes",
  },
  {
    icon: Heart,
    title: "Certificate of Indigency",
    desc: "Certifies the financial status of the applicant for social welfare and government assistance.",
    requirements: ["Valid ID", "Barangay Certificate"],
    fee: "Free",
    processing: "15–30 minutes",
  },
  {
    icon: Briefcase,
    title: "Business Clearance",
    desc: "Required for business permit applications and renewals within the barangay.",
    requirements: ["DTI Registration", "Valid ID", "Lease Contract/Lot Title"],
    fee: "₱200.00",
    processing: "1–2 days",
  },
  {
    icon: Star,
    title: "Good Moral Certificate",
    desc: "Certificate of good moral character for employment, school, or legal purposes.",
    requirements: ["Valid ID", "Cedula"],
    fee: "₱50.00",
    processing: "15–30 minutes",
  },
  {
    icon: Users,
    title: "Senior Citizen Certificate",
    desc: "Certification for senior citizens for benefits and privileges.",
    requirements: ["Senior Citizen ID", "Valid ID"],
    fee: "Free",
    processing: "15–30 minutes",
  },
  {
    icon: GraduationCap,
    title: "First Time Job Seeker Certificate",
    desc: "Certification under RA 11261 for first-time job seekers exempting them from certain fees.",
    requirements: ["Valid ID", "Oath of Undertaking"],
    fee: "Free",
    processing: "15–30 minutes",
  },
  {
    icon: Building2,
    title: "Solo Parent Certificate",
    desc: "Certification for solo parents entitled to benefits under RA 8972.",
    requirements: ["Valid ID", "Birth Certificate of Child", "DSWD Certification"],
    fee: "Free",
    processing: "1–2 days",
  },
];

export default function Services() {
  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3">Our Services</h1>
          <p className="opacity-80 max-w-xl mx-auto">Barangay San Vicente offers various government services to our residents.</p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <svc.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-lg mb-2">{svc.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{svc.desc}</p>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1">
                        <ClipboardList className="w-3 h-3" /> Requirements
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-0.5">
                        {svc.requirements.map((r) => (
                          <li key={r} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-accent font-medium">
                        <CreditCard className="w-3 h-3" /> {svc.fee}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" /> {svc.processing}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm mb-4">Need to request a document? Use our Resident Portal.</p>
          <Link to="/resident-portal">
            <Button size="lg" className="gap-2">
              <Users className="w-4 h-4" />
              Go to Resident Portal
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}