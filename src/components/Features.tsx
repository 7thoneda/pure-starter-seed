import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Rocket, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Modern Design",
    description: "Beautiful, responsive interfaces that adapt to any device with stunning visual effects and smooth animations."
  },
  {
    icon: Rocket,
    title: "Lightning Fast",
    description: "Optimized performance with cutting-edge technology stack ensuring your applications load in milliseconds."
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "Enterprise-grade security built-in with automatic updates and comprehensive protection protocols."
  },
  {
    icon: Zap,
    title: "Easy Integration",
    description: "Seamlessly connect with your existing tools and services through our comprehensive API ecosystem."
  }
];

const Features = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to build exceptional applications, all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group bg-gradient-to-br from-card to-card/50 border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-elegant hover:transform hover:scale-105"
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;