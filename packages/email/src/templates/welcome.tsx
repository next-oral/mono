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
  Text,
} from "@react-email/components";

// This component creates a professional OTP verification email for Next Oral
export const NextOralOTPEmail = ({ otp = "123456" }) => {
  return (
    <Html>
      <Head />
      <Preview>Your Next Oral verification code: {otp}</Preview>
      <Body className="m-0 bg-gray-50 p-0 font-sans">
        <Container className="mx-auto my-10 max-w-[600px] rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          {/* Header with Logo */}
          <Section className="mb-5 text-center">
            {/* Replace with actual logo URL in production */}
            <Img
              src="./next-oral.png"
              alt="Next Oral Logo"
              width="200"
              height="60"
              className="mx-auto"
            />
          </Section>

          <Hr className="my-5 border-solid border-gray-200" />

          {/* Main Content */}
          <Section>
            <Heading
              as="h2"
              className="my-8 text-center text-2xl font-semibold text-gray-800"
            >
              Verify Your Account
            </Heading>

            <Text className="text-center text-base leading-6 text-gray-800">
              Please use the verification code below to complete your sign-in
              process:
            </Text>

            {/* OTP Code Display */}
            <Section className="mx-auto my-8 w-3/5 rounded-lg border-2 border-dashed border-blue-300 bg-gray-50 p-5 text-center">
              <Text className="m-0 font-mono text-3xl font-bold tracking-widest text-blue-600">
                {otp}
              </Text>
            </Section>

            <Text className="text-center text-base leading-6 text-gray-800">
              This code will expire in <strong>5 minutes</strong>. If you did
              not request this code, please ignore this email.
            </Text>

            <Text className="mt-6 text-center text-base leading-6 text-gray-800">
              For security reasons, please never share this code with anyone.
            </Text>
          </Section>

          <Hr className="my-8 border-solid border-gray-200" />

          {/* Footer */}
          <Section>
            <Text className="text-center text-sm leading-5 text-gray-600">
              © {new Date().getFullYear()} Next Oral. All rights reserved.
            </Text>
            <Text className="text-center text-xs leading-4 text-gray-600">
              This is an automated message - please do not reply to this email.
            </Text>
            <Text className="text-center text-xs leading-4 text-gray-600">
              Next Oral - Modern Dental Management Solutions
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default NextOralOTPEmail;
