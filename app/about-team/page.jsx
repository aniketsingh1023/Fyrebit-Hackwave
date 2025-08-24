



"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

const team = [
  {
    name: "Aniket Singh",
    bio: "Best at breaking limits, not just code 💻🚀",
    image: "aniket.jpg",
    socials: { 
      github: "https://github.com/aniketsingh1023", 
      linkedin: "https://www.linkedin.com/in/aniket-singh-994b34274/", 
      instagram: "https://www.instagram.com/devvoxx" 
    },
  },
  {
    name: "Aanya Shrivastava",
    bio: "Speaks fluent API & dreams in JSON🌀",
    image: "aanya.jpg",
    socials: { 
      github: "https://github.com/Aanyas08", 
      linkedin: "https://www.linkedin.com/in/aanya-shrivastav?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", 
      instagram: "https://www.instagram.com/aanya0806?igsh=MXdkNXgwa3lycmp4aA==" 
    },
  },
  {
    name: "Alok Jumde",
    bio: "Sketches ideas → ships sleek UX🎨",
    image: "alok.jpg",
    socials: { 
      github: "https://github.com/jumdealok", 
      linkedin: "https://www.linkedin.com/in/alok-jumde-501060311?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", 
      instagram: "https://www.instagram.com/jumdealok_?igsh=MTFhM2VyNXZxdTBmYw==" 
    },
  },
  {
    name: "Paridhi Mandloi",
    bio: "Wizard of words & ideas⚡🎤",
    image: "/paridhi2.jpg",
    socials: { 
      github: "https://github.com/Paridhi029", 
      linkedin: "http://www.linkedin.com/in/paridhi029", 
      instagram: "https://www.instagram.com/paridhi_029" 
    },
  },
  {
    name: "Nilesh Bokhare",
    bio: "Creative thinker who hacks solutions outside the box💡",
    image: "/nilesh.jpg",
    socials: { 
      github: "https://github.com/nileshbokhare07-crypto", 
      linkedin: "https://www.linkedin.com/in/nilesh-bokhare-298902266?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", 
      instagram: "https://www.instagram.com/horridnick7?igsh=amV3YnJlNGljM29t" 
    },
  },
]

// ✅ SVG Icons
const GithubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.1-1.2-1.4-1.2-1.4-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.8-1.5 1.7-2 .1-.7.5-1.2.9-1.5-2.5-.3-5.1-1.3-5.1-5.7 0-1.2.4-2.1 1.1-2.9-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 2.9 1.1.8-.2 1.6-.3 2.4-.3s1.6.1 2.4.3c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.7 1.1 2.9 0 4.4-2.6 5.3-5.1 5.7.5.4 1 .9 1 2.2v3.3c0 .4.2.7.8.6 4.7-1.6 7.9-5.8 7.9-10.9C23.5 5.6 18.4.5 12 .5z" />
  </svg>
)

const LinkedinIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.98 3.5C4.98 4.9 3.9 6 2.5 6S0 4.9 0 3.5 1.1 1 2.5 1s2.48 1.1 2.48 2.5zM.5 8.5h4V24h-4V8.5zm7.5 0h3.8v2.1h.1c.5-1 1.7-2.1 3.6-2.1 3.8 0 4.5 2.5 4.5 5.8V24h-4v-7.8c0-1.9 0-4.2-2.6-4.2s-3 2-3 4.1V24h-4V8.5z" />
  </svg>
)

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm0 2c1.4 0 2.5 1.1 2.5 2.5S13.4 14.5 12 14.5 9.5 13.4 9.5 12 10.6 9.5 12 9.5zM17.5 6a1 1 0 100 2 1 1 0 000-2z" />
  </svg>
)

export default function TeamAboutPage() {
  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-mistrully text-center text-[#F5E6D3] mb-12">Meet the Team</h1>
       

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="transition-transform"
            >
              <Card
                className="overflow-hidden shadow-lg h-[450px] flex flex-col 
                bg-[#F5E6D3] text-black rounded-2xl transform 
                transition-all duration-500 ease-in-out
                hover:shadow-[0_0_20px_rgba(245,230,211,0.15)] hover:-translate-y-2"
              >
                <div className="w-full h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <CardContent className="p-6 flex flex-col justify-between flex-1 text-center">
                  <div>
                    <h2 className="text-2xl font-semibold">{member.name}</h2>
                    <p className="mt-2 text-sm">{member.bio}</p>
                  </div>
                  <div className="flex justify-center space-x-4 mt-4 text-gray-700">
                    <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-yellow-600"><GithubIcon /></a>
                    <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-yellow-600"><LinkedinIcon /></a>
                    <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-yellow-600"><InstagramIcon /></a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
