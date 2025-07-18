
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCompare } from "@/contexts/CompareContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle, ArrowLeft } from "lucide-react";
import { getInstrumentById } from "@/data/instrumentsData";
import { useProductDetails } from "@/hooks/useProductDetails";
import BuyLinksDialog from "@/components/BuyLinksDialog";
import StructuredSpecifications from "@/components/StructuredSpecifications";
import FAQSection from "@/components/FAQSection";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  
  const instrument = id ? getInstrumentById(id) : undefined;
  const { data: productDetails, isLoading: detailsLoading } = useProductDetails(id || '');
  
  const inCompare = instrument ? isInCompare(instrument.id) : false;

  const handleCompareToggle = () => {
    if (!instrument) return;
    
    if (inCompare) {
      removeFromCompare(instrument.id);
    } else {
      addToCompare(instrument.id);
    }
  };

  if (!instrument) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-6">Instrument not found</h1>
          <p className="text-gray-400 mb-6">
            Sorry, we couldn't find the instrument you were looking for.
          </p>
          <Button asChild>
            <Link to="/all-instruments">Browse All Instruments</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/all-instruments" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft size={16} className="mr-1" /> Back to instruments
          </Link>
        </div>
        
        <div className="bg-androidBox rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Image */}
            <div className="bg-black rounded-lg flex items-center justify-center p-8">
              <img 
                src={instrument.image || '/placeholder.svg'} 
                alt={instrument.name}
                className="max-w-full max-h-[400px] object-contain"
              />
            </div>
            
            {/* Info */}
            <div>
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-accent/40 rounded-full text-sm">
                  {instrument.brand}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{instrument.name}</h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{instrument.rating || "N/A"}</span>
                </div>
                <div className="text-muted-foreground">
                  {instrument.releaseYear}
                </div>
              </div>
              
              <div className="text-3xl font-bold text-primary mb-6">
                ₹{instrument.price?.toLocaleString()}
              </div>
              
              <p className="text-gray-300 mb-6">
                {instrument.description}
              </p>
              
              <div className="flex space-x-4 mb-8">
                {productDetails?.buyLinks && productDetails.buyLinks.length > 0 && (
                  <Button 
                    size="lg" 
                    className="flex-1"
                    onClick={() => setBuyDialogOpen(true)}
                  >
                    Buy Now
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={handleCompareToggle}
                  className={`flex-1 ${inCompare ? 'border-red-500 text-red-500 hover:bg-red-500/10' : ''}`}
                >
                  {inCompare ? (
                    <>
                      <MinusCircle size={18} className="mr-2" />
                      Remove from Compare
                    </>
                  ) : (
                    <>
                      <PlusCircle size={18} className="mr-2" />
                      Add to Compare
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Specifications */}
          {productDetails?.specifications && (
            <div className="border-t border-gray-700 p-6">
              <h2 className="text-2xl font-bold mb-6">Full Specifications</h2>
              <StructuredSpecifications specifications={productDetails.specifications} />
            </div>
          )}

          {/* FAQ Section */}
          {productDetails?.faq && (
            <div className="border-t border-gray-700 p-6">
              <FAQSection faqs={productDetails.faq} />
            </div>
          )}
        </div>
      </main>
      
      <Footer />

      <BuyLinksDialog 
        isOpen={buyDialogOpen}
        onClose={() => setBuyDialogOpen(false)}
        instrumentName={instrument.name}
        buyLinks={productDetails?.buyLinks || []}
      />
    </div>
  );
};

export default ProductDetail;
