import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text
} from "@react-email/components";

// This component creates a professional OTP verification email for Next Oral
export const NextOralOTPEmail = ({ otp = "123456" }) => {
  
  return (
    <Html>
      <Head />
      <Preview>Your Next Oral verification code: {otp}</Preview>
      <Body className="bg-gray-50 font-sans m-0 p-0">
        <Container className="bg-white border border-gray-200 rounded-lg shadow-sm mx-auto my-10 max-w-[600px] p-5">
          {/* Header with Logo */}
          <Section className="text-center mb-5">
            {/* Replace with actual logo URL in production */}
            <Img
              src="./next-oral.png"
              alt="Next Oral Logo"
              width="200"
              height="60"
              className="mx-auto"
            />
          </Section>
          
          <Hr className="border-gray-200 border-solid my-5" />
          
          {/* Main Content */}
          <Section>
            <Heading as="h2" className="text-gray-800 text-2xl font-semibold text-center my-8">
              Verify Your Account
            </Heading>
            
            <Text className="text-gray-800 text-base leading-6 text-center">
              Please use the verification code below to complete your sign-in process:
            </Text>
            
            {/* OTP Code Display */}
            <Section className="bg-gray-50 border-2 border-dashed border-blue-300 rounded-lg mx-auto my-8 p-5 text-center w-3/5">
              <Text className="text-blue-600 font-mono text-3xl font-bold tracking-widest m-0">
                {otp}
              </Text>
            </Section>
            
            <Text className="text-gray-800 text-base leading-6 text-center">
              This code will expire in <strong>5 minutes</strong>. If you did not request this code, please ignore this email.
            </Text>
            
            <Text className="text-gray-800 text-base leading-6 text-center mt-6">
              For security reasons, please never share this code with anyone.
            </Text>
          </Section>
          
          <Hr className="border-gray-200 border-solid my-8" />
          
          {/* Footer */}
          <Section>
            <Text className="text-gray-600 text-sm leading-5 text-center">
              © {new Date().getFullYear()} Next Oral. All rights reserved.
            </Text>
            <Text className="text-gray-600 text-xs leading-4 text-center">
              This is an automated message - please do not reply to this email.
            </Text>
            <Text className="text-gray-600 text-xs leading-4 text-center">
              Next Oral - Modern Dental Management Solutions
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default NextOralOTPEmail;