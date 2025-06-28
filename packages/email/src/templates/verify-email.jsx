import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Tailwind, Text, } from "@react-email/components";
export default function VerifyEmail({ otp = "123456" }) {
    return (<Tailwind>
      <Html>
        <Head />
        <Preview>Next Oral Email Verification</Preview>
        <Body className="bg-gray-50 font-sans text-gray-800">
          <Container className="mx-auto max-w-[600px] bg-white p-5">
            <Section className="rounded-lg bg-white shadow-sm">
              {/* Logo */}
              <Section className="flex items-center rounded-t-lg bg-blue-600 px-5 py-2">
                <Img className="mr-auto" src={"data:image/png;base64,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"} alt="Next Oral Logo"/>
              </Section>

              {/* Header & Message */}
              <Section className="px-9 py-6">
                <Heading className="mb-4 text-2xl font-semibold text-gray-800">
                  Verify your email address
                </Heading>
                <Text className="mb-4 text-base text-gray-600">
                  Thank you for creating your Next Oral account. To ensure the
                  security of your account, please enter the following
                  verification code when prompted. If you didn't request this
                  verification, you can safely ignore this message.
                </Text>

                {/* Verification Code */}
                <Section className="flex items-center justify-center">
                  <Text className="m-0 text-center text-sm font-semibold text-gray-600">
                    Verification code
                  </Text>
                  <Text className="my-4 bg-neutral-100 py-2 text-center text-3xl font-bold tracking-widest text-blue-600">
                    {otp}
                  </Text>
                  <Text className="m-0 text-center text-sm text-gray-500">
                    (This code is valid for 5 minutes)
                  </Text>
                </Section>
              </Section>

              <Hr className="border-gray-200"/>

              {/* Security Notice */}
              <Section className="px-9 py-6">
                <Text className="m-0 text-sm text-gray-600">
                  Next Oral will never email you to ask for your password,
                  credit card, or banking information. Please keep your
                  verification code secure and do not share it with anyone.
                </Text>
              </Section>
            </Section>

            {/* Footer */}
            <Text className="mt-6 px-5 text-center text-xs text-gray-500">
              © {new Date().getFullYear()} Next Oral. All rights reserved. Next
              Oral is a modern dental management solution.{" "}
              <Link href="https://nextoral.com/privacy" className="text-blue-600 underline" target="_blank">
                Privacy Policy
              </Link>{" "}
              •{" "}
              <Link href="https://nextoral.com/terms" className="text-blue-600 underline" target="_blank">
                Terms of Service
              </Link>
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>);
}
